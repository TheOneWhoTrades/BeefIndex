/* ================================================================
   BeefIndex — PRECIOS.JS  (versión 6 — actualización manual)
   ══════════════════════════════════════════════════════════════
   Este es el ÚNICO archivo que necesitás editar.
   El sitio convierte todo automáticamente a USD/kg vivo.

   FRECUENCIA SUGERIDA DE ACTUALIZACIÓN:
   · Argentina (INMAG)    → cada día hábil
   · EE.UU. (USDA)       → cada viernes (el reporte se publica los jueves/viernes)
   · Brasil (CEPEA)       → cada martes y jueves
   · UE (Comisión Eur.)   → cada lunes (reporte semanal)
   · Australia (MLA/EYCI) → cada viernes

   CÓMO ACTUALIZAR:
   1. Abrí este archivo en GitHub (lápiz para editar)
   2. Cambiá los valores según las instrucciones de cada sección
   3. Actualizá la fechaActualizacion
   4. Commit changes → el sitio se actualiza en 1-2 minutos

   FUENTES RÁPIDAS:
   · INMAG:    mercadoagroganadero.com.ar
   · USDA:     mymarketnews.ams.usda.gov → buscar "National Weekly Boxed Beef Cutout"
   · CEPEA:    cepea.esalq.usp.br/br/indicador/boi-gordo.aspx
   · UE R3:    agriculture.ec.europa.eu → Market observatories → Beef → Carcases
   · MLA EYCI: mla.com.au/prices-markets → Eastern Young Cattle Indicator
   · Dólares:  dolarito.ar (ARG) · bcb.gov.br (BRL) · xe.com (EUR, AUD)
================================================================ */

const DATOS = {

  /* ────────────────────────────────────────────────────────────
     🇦🇷  ARGENTINA — INMAG
     Fuente: mercadoagroganadero.com.ar

     QUÉ CARGAR:
       inmag_ars   → El INMAG en pesos (ARS/kg vivo)
                     Ej: si dice $4.453,13 → escribís 4453.13
       tipo_cambio → Dólar oficial del día (ARS por 1 USD)

     CONVERSIÓN AUTOMÁTICA: USD/kg vivo = inmag_ars ÷ tipo_cambio
  ──────────────────────────────────────────────────────────── */
  argentina: {
    fechaActualizacion: "01/04/2026",
    inmag_ars:    4453.13,
    tipo_cambio:  1080.00,
    cambio:    "↑ +1.8% esta semana",
    tendencia: "up",
    historico_ars: [3100, 3400, 3750, 4000, 4200, 4453],
    cortes: [
      { nombre: "Asado",           precio: 4.10, varSemana: "↑ +2.1%", varSemTend: "up", varMes: "↑ +4.5%", varMesTend: "up" },
      { nombre: "Lomo",            precio: 8.20, varSemana: "↓ -0.5%", varSemTend: "dn", varMes: "↑ +1.2%", varMesTend: "up" },
      { nombre: "Bife de chorizo", precio: 7.60, varSemana: "↑ +1.0%", varSemTend: "up", varMes: "↑ +3.0%", varMesTend: "up" },
      { nombre: "Cuadril",         precio: 5.40, varSemana: "↓ -0.8%", varSemTend: "dn", varMes: "↓ -1.1%", varMesTend: "dn" },
      { nombre: "Paleta",          precio: 3.80, varSemana: "↑ +0.5%", varSemTend: "up", varMes: "↑ +0.8%", varMesTend: "up" },
    ]
  },

  /* ────────────────────────────────────────────────────────────
     🇺🇸  ESTADOS UNIDOS — Boxed Beef Cutout Choice (USDA)
     Fuente: mymarketnews.ams.usda.gov
             → Reports → buscar "National Weekly Boxed Beef Cutout"
             → Abrís el reporte más reciente
             → Tomás el valor de "Choice" en USD/cwt

     QUÉ CARGAR:
       boxed_cutout_usd_cwt → Precio Choice en USD/cwt (hundredweight)
                              Ej: si el reporte dice 296.40 → escribís 296.40

     CONVERSIÓN AUTOMÁTICA:
       USD/kg vivo = (boxed_cutout_usd_cwt × 0.62) ÷ 220.46
       (0.62 = dressing % promedio EE.UU. | 220.46 = lb por cwt × 0.4536)
  ──────────────────────────────────────────────────────────── */
  eeuu: {
    fechaActualizacion: "28/03/2026",
    boxed_cutout_usd_cwt: 296.40,
    cambio:    "↑ +1.1% esta semana",
    tendencia: "up",
    historico_cwt: [270.5, 278.2, 285.0, 289.4, 293.1, 296.4],
  },

  /* ────────────────────────────────────────────────────────────
     🇧🇷  BRASIL — Indicador Boi Gordo CEPEA/Esalq
     Fuente: cepea.esalq.usp.br/br/indicador/boi-gordo.aspx
             → Tomás el valor "à vista" (precio al contado)

     QUÉ CARGAR:
       boi_gordo_brl_arroba → Precio en reales por arroba (BRL/@)
                              Ej: si dice R$350,00 → escribís 350.00
       tipo_cambio_brl      → Reales por 1 USD
                              Ej: si 1 USD = 5,85 BRL → escribís 5.85

     CONVERSIÓN AUTOMÁTICA:
       USD/kg vivo = boi_gordo_brl_arroba ÷ 15 ÷ tipo_cambio_brl
       (15 = kg por arroba)
  ──────────────────────────────────────────────────────────── */
  brasil: {
    fechaActualizacion: "01/04/2026",
    boi_gordo_brl_arroba: 350.00,
    tipo_cambio_brl:       5.85,
    cambio:    "↓ -0.4% esta semana",
    tendencia: "dn",
    historico_arroba: [290, 305, 318, 332, 345, 350],
  },

  /* ────────────────────────────────────────────────────────────
     🇪🇺  UNIÓN EUROPEA — R3 steer (Comisión Europea)
     Fuente: agriculture.ec.europa.eu
             → Data and analysis → Markets → Price monitoring
             → Beef carcases → tabla semanal → columna "R3 steer" UE promedio

     QUÉ CARGAR:
       r3_eur_100kg    → Precio R3 steer en EUR por 100 kg de carcasa
                         Ej: si la tabla dice 480,50 → escribís 480.50
       tipo_cambio_eur → EUR por 1 USD
                         Ej: si 1 USD = 0,926 EUR → escribís 0.926
                         (Es el inverso del EUR/USD que ves en Google:
                          si EUR/USD = 1.08 → 1/1.08 = 0.926)

     CONVERSIÓN AUTOMÁTICA:
       USD/kg vivo = (r3_eur_100kg ÷ 100) × 0.55 ÷ tipo_cambio_eur
       (0.55 = killing-out % promedio UE | ÷100 = de 100kg a 1kg)
  ──────────────────────────────────────────────────────────── */
  ue: {
    fechaActualizacion: "28/03/2026",
    r3_eur_100kg:    480.50,
    tipo_cambio_eur:   0.926,
    cambio:    "↑ +2.1% esta semana",
    tendencia: "up",
    historico_r3: [440, 452, 461, 469, 475, 480],
  },

  /* ────────────────────────────────────────────────────────────
     🇦🇺  AUSTRALIA — EYCI (Eastern Young Cattle Indicator)
     Fuente: mla.com.au/prices-markets
             → Indicators → Eastern Young Cattle Indicator
             → Tomás el valor más reciente en cents/kg liveweight

     QUÉ CARGAR:
       eyci_aud_cents_kg → EYCI en cents australianos por kg vivo
                           Ej: si MLA dice 820c/kg → escribís 820
       tipo_cambio_aud   → AUD por 1 USD
                           Ej: si 1 USD = 1,587 AUD → escribís 1.587
                           (Es el inverso del AUD/USD:
                            si AUD/USD = 0.63 → 1/0.63 = 1.587)

     CONVERSIÓN AUTOMÁTICA:
       USD/kg vivo = (eyci_aud_cents_kg ÷ 100) ÷ tipo_cambio_aud
       (÷100 = de cents a dólares australianos)
  ──────────────────────────────────────────────────────────── */
  australia: {
    fechaActualizacion: "28/03/2026",
    eyci_aud_cents_kg: 820,
    tipo_cambio_aud:   1.587,
    cambio:    "↑ +1.2% esta semana",
    tendencia: "up",
    historico_eyci: [780, 795, 808, 815, 812, 820],
  },

};
/* ================================================================
   FIN — No modificar nada debajo de esta línea
================================================================ */
