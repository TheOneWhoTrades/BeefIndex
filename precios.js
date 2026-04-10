/* ================================================================
   BeefIndex — PRECIOS.JS  (versión 7)
   ══════════════════════════════════════════════════════════════

   ESTRUCTURA DEL SITIO
   ─────────────────────
   El sitio tiene DOS grupos de mercados:

   COMPETIDORES (países que exportan carne, como Argentina):
   · 🇦🇷 Argentina  · 🇧🇷 Brasil  · 🇦🇺 Australia

   COMPRADORES (mercados donde Argentina puede vender):
   · 🇨🇳 China  · 🇺🇸 Estados Unidos  · 🇪🇺 Unión Europea  · 🇮🇱 Israel

   ÍNDICES POR GRUPO
   ─────────────────
   Todos los mercados muestran DOS índices:

   1er índice — NOVILLO VIVO EQUIVALENTE (USD/kg vivo)
      Mismo concepto en todos los mercados.
      Te dice cuánto vale el animal vivo en cada plaza.
      El sitio hace la conversión automáticamente.

   2do índice — depende del grupo:
      COMPETIDORES → Precio de carcasa en mercado local (USD/ton)
                     Lo que recibe el frigorífico por la carcasa.
                     Refleja el costo de la materia prima del competidor.

      COMPRADORES  → Precio de importación CIF (USD/ton)
                     Lo que paga ese mercado por la carne importada.
                     Es el precio que podés obtener si exportás ahí.

   CÓMO ACTUALIZAR
   ────────────────
   1. Abrí este archivo en GitHub (clic en el lápiz para editar)
   2. Modificá SOLO los valores numéricos dentro de cada sección
   3. Actualizá la fechaActualizacion con la fecha de hoy (DD/MM/AAAA)
   4. Al final hacé clic en "Commit changes"
   5. El sitio se actualiza solo en 1-2 minutos

================================================================ */

const DATOS = {

/* ════════════════════════════════════════════════════════
   GRUPO 1 — COMPETIDORES EXPORTADORES
   ════════════════════════════════════════════════════════ */

  /* ──────────────────────────────────────────────────────
     🇦🇷 ARGENTINA
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — INMAG (Novillo vivo)
     Fuente: mercadoagroganadero.com.ar
     Publicado: cada día hábil
     Qué cargar:
       · inmag_ars   → El número del INMAG en ARS/kg vivo
                       Ej: si dice $4.453,13 → escribís 4453.13
       · tipo_cambio → Dólar oficial del día (ARS por 1 USD)
                       Fuente: dolarito.ar o bcra.gob.ar
     Conversión automática: USD/kg vivo = inmag_ars ÷ tipo_cambio

     ÍNDICE 2 — Precio de carcasa doméstico
     Fuente: APEA (apea.org.ar → Boletines → "Precios Carne $/kg gancho")
             o Valor Carne (valorcarne.com.ar → Mercados)
     Publicado: semanal
     Qué cargar:
       · gancho_ars  → Precio en ARS/kg gancho (carcasa)
                       Ej: si dice $7.200/kg → escribís 7200
     Conversión automática: USD/ton = (gancho_ars ÷ tipo_cambio) × 1000
  ────────────────────────────────────────────────────── */
  argentina: {
    fechaActualizacion: "01/04/2026",

    /* 1er índice */
    inmag_ars:    4453.13,
    tipo_cambio:  1080.00,
    cambio_vivo:    "↑ +1.8% esta semana",
    tendencia_vivo: "up",

    /* 2do índice */
    gancho_ars:   7200,
    cambio_gancho:    "↑ +2.1% esta semana",
    tendencia_gancho: "up",

    /* Gráfico histórico (últimos 6 meses, en ARS/kg vivo) */
    historico: [3100, 3400, 3750, 4000, 4200, 4453],

    /* Tabla de cortes de exportación */
    cortes: [
      { nombre: "Asado",           precio: 4.10, varSemana: "↑ +2.1%", varSemTend: "up", varMes: "↑ +4.5%", varMesTend: "up" },
      { nombre: "Lomo",            precio: 8.20, varSemana: "↓ -0.5%", varSemTend: "dn", varMes: "↑ +1.2%", varMesTend: "up" },
      { nombre: "Bife de chorizo", precio: 7.60, varSemana: "↑ +1.0%", varSemTend: "up", varMes: "↑ +3.0%", varMesTend: "up" },
      { nombre: "Cuadril",         precio: 5.40, varSemana: "↓ -0.8%", varSemTend: "dn", varMes: "↓ -1.1%", varMesTend: "dn" },
      { nombre: "Paleta",          precio: 3.80, varSemana: "↑ +0.5%", varSemTend: "up", varMes: "↑ +0.8%", varMesTend: "up" },
    ]
  },

  /* ──────────────────────────────────────────────────────
     🇧🇷 BRASIL
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — Boi Gordo CEPEA (Novillo vivo equivalente)
     Fuente: cepea.esalq.usp.br/br/indicador/boi-gordo.aspx
     Publicado: cada día hábil
     Qué cargar:
       · boi_gordo_brl_arroba → Indicador CEPEA "à vista" en BRL/@
                                 Ej: si dice R$350,00/@ → escribís 350.00
       · tipo_cambio_brl      → BRL por 1 USD
                                 Fuente: bcb.gov.br o xe.com
     Conversión automática: USD/kg vivo = (boi_gordo ÷ 15) ÷ tipo_cambio

     ÍNDICE 2 — Precio de carcasa doméstico (atacado São Paulo)
     Fuente: cepea.esalq.usp.br/en/indicator/cattle.aspx  (sitio en inglés)
             → Buscar el precio de carcasa bovina en USD/kg
     Publicado: semanal

     Qué cargar (elegí UNA de las dos opciones):

     OPCIÓN A — Directo desde CEPEA en inglés (recomendado, más simple):
       · gancho_usd_kg → Precio en USD/kg carcasa que muestra CEPEA en inglés
                          Ej: si dice USD 4.28/kg → escribís 4.28
       Conversión automática: USD/ton = gancho_usd_kg × 1000
       → Dejá gancho_brl_kg en null si usás esta opción.

     OPCIÓN B — Desde CEPEA en portugués (si preferís la fuente original):
       · gancho_brl_kg → Precio en BRL/kg gancho (carcasa)
                          Ej: si dice R$21,00/kg → escribís 21.00
       Conversión automática: USD/ton = (gancho_brl_kg ÷ tipo_cambio) × 1000
       → Dejá gancho_usd_kg en null si usás esta opción.
  ────────────────────────────────────────────────────── */
  brasil: {
    fechaActualizacion: "01/04/2026",

    /* 1er índice */
    boi_gordo_brl_arroba: 350.00,
    tipo_cambio_brl:        5.85,
    cambio_vivo:    "↓ -0.4% esta semana",
    tendencia_vivo: "dn",

    /* 2do índice — usá UNA opción, la otra en null */
    gancho_usd_kg:   4.28,   /* ← OPCIÓN A: USD/kg directo de CEPEA en inglés */
    gancho_brl_kg:   null,   /* ← OPCIÓN B: BRL/kg (dejar null si usás A)     */
    cambio_gancho:    "↑ +1.2% esta semana",
    tendencia_gancho: "up",

    /* Gráfico histórico (últimos 6 meses, en BRL/arroba) */
    historico: [290, 305, 318, 332, 345, 350],
  },

  /* ──────────────────────────────────────────────────────
     🇦🇺 AUSTRALIA
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — EYCI (Eastern Young Cattle Indicator)
     Fuente: mla.com.au/prices-markets → Eastern Young Cattle Indicator
     Publicado: cada día hábil
     Qué cargar:
       · eyci_aud_cents_kg → EYCI en AUD cents/kg liveweight
                              Ej: si MLA dice 820c/kg → escribís 820
       · tipo_cambio_aud   → AUD por 1 USD (inverso del AUD/USD)
                              Ej: si AUD/USD = 0.63 → escribís 1.587 (= 1÷0.63)
                              Fuente: xe.com
     Conversión automática: USD/kg vivo = (eyci ÷ 100) ÷ tipo_cambio_aud

     ÍNDICE 2 — Heavy Steer over-the-hooks (precio de carcasa)
     Fuente: mla.com.au/prices-markets → Over-the-hooks → Heavy Steer
             Sección "National" o "Eastern states"
     Publicado: semanal
     Qué cargar:
       · heavy_steer_aud_cents_kg → Precio en AUD cents/kg carcasa (dressed weight)
                                     Ej: si MLA dice 840c/kg dw → escribís 840
     Conversión automática: USD/ton = (heavy_steer ÷ 100) ÷ tipo_cambio × 1000
  ────────────────────────────────────────────────────── */
  australia: {
    fechaActualizacion: "01/04/2026",

    /* 1er índice */
    eyci_aud_cents_kg:  820,
    tipo_cambio_aud:    1.587,
    cambio_vivo:    "↑ +1.2% esta semana",
    tendencia_vivo: "up",

    /* 2do índice */
    heavy_steer_aud_cents_kg: 840,
    cambio_gancho:    "↑ +0.8% esta semana",
    tendencia_gancho: "up",

    /* Gráfico histórico (últimos 6 meses, en AUD c/kg liveweight) */
    historico: [780, 795, 808, 815, 812, 820],
  },


/* ════════════════════════════════════════════════════════
   GRUPO 2 — MERCADOS COMPRADORES
   ════════════════════════════════════════════════════════ */

  /* ──────────────────────────────────────────────────────
     🇨🇳 CHINA
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — Precio implícito de importación (novillo vivo equiv.)
     No existe un índice de novillo vivo en China equivalente al INMAG.
     Se estima a partir del precio CIF de importación aplicando el
     factor inverso (÷ 0.55 para deshacer la conversión carcasa→vivo).
     El sitio calcula esto automáticamente a partir del CIF.

     ÍNDICE 2 — Precio CIF de importación (carne al gancho)
     Fuente: APEA (apea.org.ar → "Precios internacionales del mercado")
             o Trade Data Monitor / China Customs (GACC)
             Referencia mensual: precio promedio USD/ton que paga China
             por carne vacuna importada (frozen boneless beef)
     Publicado: mensual (con 1-2 meses de rezago)
     Qué cargar:
       · cif_usd_ton → Precio CIF en USD por tonelada
                        Ej: si China pagó USD 5.200/ton → escribís 5200
     Nota: China tiene cuota por país desde 2026 (55% extra sobre cuota).
           Usar el precio promedio ponderado total de importaciones.
  ────────────────────────────────────────────────────── */
  china: {
    fechaActualizacion: "01/04/2026",

    /* 2do índice — CIF importación */
    cif_usd_ton:  5200,
    cambio_cif:    "↑ +3.5% este mes",
    tendencia_cif: "up",

    /* Gráfico histórico (últimos 6 meses, USD/ton CIF) */
    historico: [4600, 4750, 4900, 5000, 5100, 5200],

    /* Contexto relevante */
    nota: "Cuota 2026: 511.000 ton (Argentina). Arancel extra 55% sobre cuota."
  },

  /* ──────────────────────────────────────────────────────
     🇺🇸 ESTADOS UNIDOS
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — CME Live Cattle (novillo vivo en pie)
     Fuente: cmegroup.com → Markets → Agriculture → Livestock → Live Cattle
             o barchart.com/futures/quotes/LE*0
             Tomar el contrato del mes más próximo (front month)
     Publicado: en tiempo real (mercado abierto lunes a viernes)
     Qué cargar:
       · cme_live_cattle_cwt → Precio del contrato front-month en USD/cwt
                                Ej: si cotiza 242.50 → escribís 242.50
     Conversión automática: USD/kg vivo = (cme_cwt × 0.4536) ÷ 100
     (0.4536 = kg por libra | ÷100 porque cwt = 100 lb)

     ÍNDICE 2 — Precio CIF de importación (90CL beef)
     Fuente: S&P Global Platts (acceso pago) — alternativa gratuita:
             USDA AMS Imported Beef Trade Report (semanal, viernes)
             ams.usda.gov → Market News → Weekly Beef Reports
             → "Weekly Imported Beef Trade Report"
             Buscar precio promedio CIF de carne importada
             O referencia mensual de APEA (apea.org.ar → Boletines)
     Publicado: semanal
     Qué cargar:
       · cif_usd_ton → Precio CIF 90CL beef en USD/ton
                        Ej: si el reporte muestra USD 8.200/ton → escribís 8200
  ────────────────────────────────────────────────────── */
  eeuu: {
    fechaActualizacion: "01/04/2026",

    /* 1er índice */
    cme_live_cattle_cwt: 242.50,
    cambio_vivo:    "↑ +1.5% esta semana",
    tendencia_vivo: "up",

    /* 2do índice */
    cif_usd_ton:   8200,
    cambio_cif:    "↑ +0.8% esta semana",
    tendencia_cif: "up",

    /* Gráfico histórico (últimos 6 meses, USD/cwt CME Live Cattle) */
    historico: [220.5, 226.2, 231.0, 235.4, 239.1, 242.5],
  },

  /* ──────────────────────────────────────────────────────
     🇪🇺 UNIÓN EUROPEA
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — R3 steer precio vivo equivalente
     Se calcula automáticamente desde el CIF y el R3 steer.
     No existe un índice de novillo vivo único en la UE.
     El sitio estima el equivalente vivo a partir del R3 steer
     aplicando el killing-out % promedio de la UE (55%).

     El R3 steer es el precio de carcasa de referencia de la UE.
     Fuente: agriculture.ec.europa.eu
             → Data and analysis → Markets → Price monitoring → Beef carcases
             Tomar el precio "EU average R3 steer" en EUR/100kg carcasa
     Publicado: semanal (cada lunes)
     Qué cargar:
       · r3_eur_100kg    → Precio R3 steer en EUR/100kg carcasa
                            Ej: si la tabla dice 480,50 → escribís 480.50
       · tipo_cambio_eur → EUR por 1 USD
                            Ej: si EUR/USD = 1.08 → escribís 0.926 (= 1 ÷ 1.08)
     Conversión 1er índice: USD/kg vivo = (r3 ÷ 100 × 0.55) ÷ tipo_cambio

     ÍNDICE 2 — Precio CIF de importación de la UE (carne al gancho)
     Fuente: Comisión Europea → Agri-food data portal → Beef → Trade
             (agridata.ec.europa.eu → Beef → Trade → Import prices)
             O referencia de APEA (apea.org.ar → Boletines → "Hilton/481")
     Qué cargar:
       · cif_eur_ton → Precio CIF importación en EUR/ton
                        Ej: si Eurostat muestra 6.500 EUR/ton → escribís 6500
     Conversión automática: USD/ton = cif_eur_ton ÷ tipo_cambio
  ────────────────────────────────────────────────────── */
  ue: {
    fechaActualizacion: "01/04/2026",

    /* 1er índice */
    r3_eur_100kg:    480.50,
    tipo_cambio_eur:   0.926,
    cambio_vivo:    "↑ +2.1% esta semana",
    tendencia_vivo: "up",

    /* 2do índice */
    cif_eur_ton:   6500,
    cambio_cif:    "↑ +1.8% esta semana",
    tendencia_cif: "up",

    /* Gráfico histórico (últimos 6 meses, EUR/100kg R3 steer) */
    historico: [440, 452, 461, 469, 475, 480],
  },

  /* ──────────────────────────────────────────────────────
     🇮🇱 ISRAEL
     ──────────────────────────────────────────────────────
     ÍNDICE 1 — Precio implícito novillo vivo equivalente
     Se calcula automáticamente desde el CIF de importación.

     ÍNDICE 2 — Precio CIF de importación (carne al gancho)
     Fuente: APEA (apea.org.ar → Boletines → precios FOB a Israel)
             Los frigoríficos argentinos publican sus precios FOB a Israel.
             El CIF de Israel ≈ FOB Argentina + flete (aprox. +$150-200/ton)
             Alternativa: Israeli Central Bureau of Statistics (cbs.gov.il)
                          → Foreign Trade → Import prices → Beef
     Publicado: mensual
     Qué cargar:
       · cif_usd_ton → Precio CIF en USD/ton que paga Israel por carne importada
                        Ej: si APEA informa FOB $8.500/ton, el CIF ≈ $8.700
     Nota: Israel importa principalmente cortes kosher y carne enfriada.
           Los precios son más altos que el promedio global por estas exigencias.
  ────────────────────────────────────────────────────── */
  israel: {
    fechaActualizacion: "01/04/2026",

    /* 2do índice */
    cif_usd_ton:  8800,
    cambio_cif:    "↑ +2.0% este mes",
    tendencia_cif: "up",

    /* Gráfico histórico (últimos 6 meses, USD/ton CIF) */
    historico: [7800, 8000, 8200, 8400, 8600, 8800],

    /* Contexto */
    nota: "Incluye requisito kosher. Aprox. 20-25 plantas argentinas habilitadas."
  },

};
/* ================================================================
   FIN — No modificar nada debajo de esta línea
================================================================ */
