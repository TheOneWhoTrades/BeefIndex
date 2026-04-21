"""
BeefIndex — update_precios.py
==============================
Obtiene automáticamente los datos que tienen fuente pública
y actualiza precios.js conservando el resto de los valores.

DATOS AUTOMÁTICOS:
  ✅ Tipo de cambio USD/ARS  → open.er-api.com (gratis, sin clave)
  ✅ Tipo de cambio USD/BRL  → open.er-api.com
  ✅ Tipo de cambio USD/AUD  → open.er-api.com
  ✅ Tipo de cambio USD/EUR  → open.er-api.com
  ✅ CME Live Cattle (USD/cwt) → stooq.com (gratis, sin clave)
  ✅ Boi Gordo CEPEA (BRL/@)  → scraping de cepea.esalq.usp.br

DATOS MANUALES (no se tocan):
  ✋ inmag_ars, gancho_ars (Argentina)
  ✋ gancho_usd_kg (Brasil)
  ✋ eyci_aud_cents_kg, heavy_steer_aud_cents_kg (Australia)
  ✋ cif_usd_ton (China, EE.UU., Israel)
  ✋ cif_eur_ton, r3_eur_100kg (UE)
  ✋ cambio_* de compradores, historico[], notas
"""

import re
import json
import urllib.request
import urllib.error
from datetime import date, datetime
import sys

PRECIOS_FILE = "precios.js"

FX_URL   = "https://open.er-api.com/v6/latest/USD"
CME_URL  = "https://stooq.com/q/l/?s=lc.f&f=sd2t2ohlcv&h&e=json"
CEPEA_URL = "https://cepea.esalq.usp.br/br/indicador/boi-gordo.aspx"


# ─────────────────────────────────────────────
# HELPERS HTTP
# ─────────────────────────────────────────────

def fetch_json(url, timeout=15):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "BeefIndex-bot/1.0 (github.com/TheOneWhoTrades/BeefIndex)"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())

def fetch_html(url, timeout=15):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; BeefIndex-bot/1.0)",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "pt-BR,pt;q=0.9",
        }
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", errors="replace")


# ─────────────────────────────────────────────
# FUENTES DE DATOS
# ─────────────────────────────────────────────

def get_fx_rates():
    print("→ Obteniendo tipos de cambio (open.er-api.com)...")
    try:
        data = fetch_json(FX_URL)
        rates = data["rates"]
        result = {
            "ars_per_usd": round(float(rates["ARS"]), 2),
            "brl_per_usd": round(float(rates["BRL"]), 4),
            "aud_per_usd": round(float(rates["AUD"]), 4),
            "eur_per_usd": round(float(rates["EUR"]), 4),
        }
        for k, v in result.items():
            print(f"   {k}: {v}")
        return result
    except Exception as e:
        print(f"   ⚠ Error FX: {e}")
        return None


def get_cme_live_cattle():
    print("→ Obteniendo CME Live Cattle (stooq.com)...")
    try:
        data = fetch_json(CME_URL)
        symbols = data.get("symbols", [])
        if not symbols:
            raise ValueError("Respuesta vacía de stooq")
        close = float(symbols[0]["close"])
        print(f"   CME Live Cattle: ${close:.2f}/cwt")
        return close
    except Exception as e:
        print(f"   ⚠ Error CME: {e}")
        return None


def get_boi_gordo():
    print("→ Obteniendo Boi Gordo CEPEA (cepea.esalq.usp.br)...")
    try:
        html = fetch_html(CEPEA_URL)
        patterns = [
            r'R\$\s*[\xa0\s]*([\d]{2,3}[.,][\d]{2})',
            r'vista[^<]*?(\d{3}[.,]\d{2})',
            r'"cot_atual"[^>]*>R\$\s*([\d.,]+)',
            r'(\d{3}),(\d{2})',
        ]
        for i, pattern in enumerate(patterns):
            matches = re.findall(pattern, html)
            if matches:
                raw = matches[0] if isinstance(matches[0], str) else ",".join(matches[0])
                raw = raw.replace(".", "").replace(",", ".")
                value = float(raw)
                if 100 < value < 1000:
                    print(f"   Boi Gordo: R${value:.2f}/@ (patrón {i+1})")
                    return value
        print("   ⚠ No se pudo extraer el valor del Boi Gordo")
        return None
    except Exception as e:
        print(f"   ⚠ Error CEPEA: {e}")
        return None


# ─────────────────────────────────────────────
# HELPERS DE PARSING — con scope por sección
# ─────────────────────────────────────────────

def update_in_section(content, section_name, field_name, new_value, is_string=False):
    """
    Reemplaza field_name SOLO dentro de la sección indicada.
    Evita pisar el mismo campo en otro mercado.
    """
    sec_pattern = re.compile(
        r'(' + re.escape(section_name) + r'\s*:\s*\{)(.*?)(\},)',
        re.DOTALL
    )
    m = sec_pattern.search(content)
    if not m:
        print(f"   ⚠ Sección no encontrada: {section_name}")
        return content, False

    body = m.group(2)

    if is_string:
        field_pat = r'(' + re.escape(field_name) + r'\s*:\s*")[^"]*(")'
        new_body, count = re.subn(field_pat, r'\g<1>' + str(new_value) + r'\g<2>', body)
    else:
        field_pat = r'(' + re.escape(field_name) + r'\s*:\s*)[\d.]+([,\s])'
        new_body, count = re.subn(field_pat, r'\g<1>' + str(new_value) + r'\g<2>', body)

    if count == 0:
        print(f"   ⚠ Campo '{field_name}' no encontrado en '{section_name}'")
        return content, False

    return content[:m.start(2)] + new_body + content[m.end(2):], True


def extract_in_section(content, section_name, field_name):
    sec_pattern = re.compile(
        re.escape(section_name) + r'\s*:\s*\{(.*?)\},',
        re.DOTALL
    )
    m = sec_pattern.search(content)
    if not m: return None
    fm = re.search(re.escape(field_name) + r'\s*:\s*([\d.]+)', m.group(1))
    if fm: return float(fm.group(1))
    return None


def calc_tendencia(valor_nuevo, valor_viejo):
    if valor_viejo is None or valor_viejo == 0:
        return f"Actualizado {date.today().strftime('%d/%m')}", None
    diff_pct = ((valor_nuevo - valor_viejo) / valor_viejo) * 100
    signo = "↑" if diff_pct >= 0 else "↓"
    tend  = "up" if diff_pct >= 0 else "dn"
    return f"{signo} {abs(diff_pct):.1f}% vs semana anterior", tend


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print("\n╔══════════════════════════════════════╗")
    print("║  BeefIndex — Actualización automática ║")
    print(f"║  {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}               ║")
    print("╚══════════════════════════════════════╝\n")

    try:
        with open(PRECIOS_FILE, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"✅ Leído {PRECIOS_FILE} ({len(content)} chars)\n")
    except FileNotFoundError:
        print(f"❌ No se encontró {PRECIOS_FILE}")
        sys.exit(1)

    updated = False
    today_str = date.today().strftime("%d/%m/%Y")

    # ── Tipos de cambio ──
    fx = get_fx_rates()
    if fx:
        old = extract_in_section(content, "argentina", "tipo_cambio")
        content, ok = update_in_section(content, "argentina", "tipo_cambio", fx["ars_per_usd"])
        if ok:
            print(f"   ✅ ARS/USD: {old} → {fx['ars_per_usd']}")
            updated = True

        old = extract_in_section(content, "brasil", "tipo_cambio_brl")
        content, ok = update_in_section(content, "brasil", "tipo_cambio_brl", fx["brl_per_usd"])
        if ok:
            print(f"   ✅ BRL/USD: {old} → {fx['brl_per_usd']}")
            updated = True

        old = extract_in_section(content, "australia", "tipo_cambio_aud")
        content, ok = update_in_section(content, "australia", "tipo_cambio_aud", fx["aud_per_usd"])
        if ok:
            print(f"   ✅ AUD/USD: {old} → {fx['aud_per_usd']}")
            updated = True

        old = extract_in_section(content, "ue", "tipo_cambio_eur")
        content, ok = update_in_section(content, "ue", "tipo_cambio_eur", fx["eur_per_usd"])
        if ok:
            print(f"   ✅ EUR/USD: {old} → {fx['eur_per_usd']}")
            updated = True
        print()

    # ── CME Live Cattle ──
    cme = get_cme_live_cattle()
    if cme:
        old_cme = extract_in_section(content, "eeuu", "cme_live_cattle_cwt")
        chg_us, tend_us = calc_tendencia(cme, old_cme)
        content, ok = update_in_section(content, "eeuu", "cme_live_cattle_cwt", round(cme, 2))
        if ok:
            content, _ = update_in_section(content, "eeuu", "cambio_vivo", chg_us, is_string=True)
            if tend_us:
                content, _ = update_in_section(content, "eeuu", "tendencia_vivo", tend_us, is_string=True)
            print(f"   ✅ CME Live Cattle: {old_cme} → {cme:.2f}  ({chg_us})")
            updated = True
        print()

    # ── Boi Gordo CEPEA ──
    boi = get_boi_gordo()
    if boi:
        old_boi = extract_in_section(content, "brasil", "boi_gordo_brl_arroba")
        chg_br, tend_br = calc_tendencia(boi, old_boi)
        content, ok = update_in_section(content, "brasil", "boi_gordo_brl_arroba", round(boi, 2))
        if ok:
            print(f"   ✅ Boi Gordo: {old_boi} → {boi:.2f}  ({chg_br})")
            updated = True
        print()

    # ── Fechas ──
    if fx or cme or boi:
        pattern = r'(fechaActualizacion\s*:\s*")[^"]*(")'
        content = re.sub(pattern, r'\g<1>' + today_str + r'\g<2>', content)
        print(f"✅ fechaActualizacion → {today_str}\n")

    # ── Guardar ──
    if updated:
        with open(PRECIOS_FILE, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ {PRECIOS_FILE} guardado.")
    else:
        print("⚠ No se realizaron cambios (todas las fuentes fallaron).")
        sys.exit(1)

    # ── Resumen ──
    print("\n┌─────────────────────────────────────────┐")
    print("│  RESUMEN                                │")
    print("├─────────────────────────────────────────┤")
    print(f"│  Fecha: {today_str:<33}│")
    if fx:
        print(f"│  ARS/USD: {fx['ars_per_usd']:<31}│")
        print(f"│  BRL/USD: {fx['brl_per_usd']:<31}│")
        print(f"│  AUD/USD: {fx['aud_per_usd']:<31}│")
        print(f"│  EUR/USD: {fx['eur_per_usd']:<31}│")
    if cme:
        print(f"│  CME:     ${cme:.2f}/cwt{'':<22}│")
    if boi:
        print(f"│  Boi:     R${boi:.2f}/@{'':<22}│")
    print("│                                         │")
    print("│  Actualizar manualmente:                │")
    print("│  inmag_ars · gancho_ars · eyci          │")
    print("│  cif de China/EEUU/Israel/UE · r3 · hist│")
    print("└─────────────────────────────────────────┘")


if __name__ == "__main__":
    main()
