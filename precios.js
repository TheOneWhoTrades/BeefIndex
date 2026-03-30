/* ================================================================
   BeefIndex — PRECIOS.JS
   ══════════════════════════════════════════════════════════════
   Este es el ÚNICO archivo que necesitás editar para actualizar
   los precios del sitio.

   CÓMO ACTUALIZAR:
   1. Abrí este archivo con el Bloc de Notas o VS Code
   2. Cambiá los valores numéricos y los textos de variación
   3. Actualizá la fechaActualizacion con la fecha de hoy
   4. Guardá el archivo
   5. Subí AMBOS archivos a Netlify (precios.js y beefindex.html)

   FORMATO DE VARIACIÓN:
   - Si el precio subió:  "↑ +2.1% esta semana"
   - Si el precio bajó:   "↓ -0.4% esta semana"
   - tendencia "up" = verde   |   tendencia "dn" = rojo

   HISTÓRICO (últimos 6 meses, de más antiguo a más reciente):
   historico: [mes1, mes2, mes3, mes4, mes5, mes6_actual]
================================================================ */

const DATOS = {

  /* ────────────────────────────────
     🇦🇷  ARGENTINA
     Fuente: APEA / Mercado de Liniers
  ──────────────────────────────── */
  argentina: {
    fechaActualizacion: "28/03/2026",

    canal: {
      valor:     3.20,              // ← Precio en USD/kg
      cambio:    "↑ +1.8% esta semana",
      tendencia: "up"               // "up" o "dn"
    },
    fob: {
      valor:     4850,              // ← Precio en USD/ton
      cambio:    "↑ +0.9% este mes",
      tendencia: "up"
    },

    // Últimos 6 meses en USD/kg (Oct → Mar)
    historico: [2.80, 2.90, 3.00, 3.05, 3.14, 3.20],

    // Tabla de cortes exportables
    cortes: [
      { nombre: "Asado",           precio: 4.10, varSemana: "↑ +2.1%", varSemTend: "up", varMes: "↑ +4.5%", varMesTend: "up" },
      { nombre: "Lomo",            precio: 8.20, varSemana: "↓ -0.5%", varSemTend: "dn", varMes: "↑ +1.2%", varMesTend: "up" },
      { nombre: "Bife de chorizo", precio: 7.60, varSemana: "↑ +1.0%", varSemTend: "up", varMes: "↑ +3.0%", varMesTend: "up" },
      { nombre: "Cuadril",         precio: 5.40, varSemana: "↓ -0.8%", varSemTend: "dn", varMes: "↓ -1.1%", varMesTend: "dn" },
      { nombre: "Paleta",          precio: 3.80, varSemana: "↑ +0.5%", varSemTend: "up", varMes: "↑ +0.8%", varMesTend: "up" },
    ]
  },

  /* ────────────────────────────────
     🇧🇷  BRASIL
     Fuente: CEPEA / Esalq
  ──────────────────────────────── */
  brasil: {
    fechaActualizacion: "28/03/2026",

    canal: {
      valor:     4.10,              // ← USD/kg
      cambio:    "↓ -0.4% esta semana",
      tendencia: "dn"
    },
    fob: {
      valor:     5100,              // ← USD/ton
      cambio:    "↑ +0.3% este mes",
      tendencia: "up"
    },

    historico: [3.90, 4.00, 4.15, 4.20, 4.12, 4.10]
  },

  /* ────────────────────────────────
     🇪🇺  UNIÓN EUROPEA
     Fuente: Eurostat / Comisión Europea
  ──────────────────────────────── */
  ue: {
    fechaActualizacion: "28/03/2026",

    canal: {
      valor:     5.90,              // ← USD/kg
      cambio:    "↑ +2.1% esta semana",
      tendencia: "up"
    },
    fob: {
      valor:     6350,              // ← USD/ton
      cambio:    "↑ +1.5% este mes",
      tendencia: "up"
    },

    historico: [5.20, 5.35, 5.50, 5.60, 5.75, 5.90]
  },

  /* ────────────────────────────────
     🇦🇺  AUSTRALIA
     Fuente: MLA / NLRS
     Nota: el sitio también intenta
     obtener el EYCI en vivo desde
     la API pública de MLA.
     Estos datos se usan como
     respaldo si la API no responde.
  ──────────────────────────────── */
  australia: {
    fechaActualizacion: "28/03/2026",

    eyci: {
      valor:     820,               // ← EYCI en AUD cents/kg liveweight
      cambio:    "↑ +1.2% esta semana",
      tendencia: "up"
    },
    heavySteer: {
      valor:     840,               // ← Heavy Steer en AUD cents/kg dressed weight
      cambio:    "↑ +0.8% esta semana",
      tendencia: "up"
    },

    // Histórico EYCI últimos 6 meses (AUD c/kg lw)
    historico: [780, 795, 808, 815, 812, 820]
  }

};
/* ================================================================
   FIN — No modificar nada debajo de esta línea
================================================================ */
