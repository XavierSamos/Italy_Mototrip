# AGENTS.md

Guía para agentes (Claude, Codex, etc.) que trabajen en este proyecto.

## Qué es

Planificador estático de un viaje en moto padre e hijo (2 motos DCT): **Lloret de Mar ➔ Roma ➔ Sicilia ➔ Cerdeña, 9–20 noviembre 2026**. Una sola página con 8 pestañas: mapa, itinerario diario, km por ciudades, presupuesto, ferrys, actividades, equipaje y alojamientos.

- **Sin build, sin npm, sin framework.** HTML + JS clásico + Tailwind por CDN + Leaflet 1.9.4 por CDN.
- **Todo el texto visible está en español** (es-ES). Mantén ese idioma y tono en cualquier contenido nuevo.

## Estructura

```
index.html            Marcado de las 8 pestañas y los 2 modales; carga CSS y JS
css/styles.css        Estilos propios: mapa, pestaña activa, responsive y overrides del tema claro
js/data/days.js       daysData       – 12 etapas (fuente principal del itinerario)
js/data/activities.js activitiesData – 38 actividades con lat/lng
js/data/ferries.js    ferriesData    – fichas de los 4 ferrys
js/core.js            switchTab, closeModal, tema claro/oscuro
js/map.js             initMap – mapa general (waypoints propios, no salen de daysData)
js/itinerary.js       Tarjetas del Tab 2 + modal por horas (openHourlyModal)
js/cities.js          Tabla del Tab 3 (desde daysData)
js/transport.js       Tab 5: tarjetas de ferry + tramos en moto
js/activities.js      Tab 6: filtros, búsqueda, favoritos, mapa colapsable, modal
js/budget.js          Tab 4: calculadora (modo 'dual' / 'solo')
js/packing.js         Tab 7: checklist persistente
js/main.js            Arranque en DOMContentLoaded
```

## Reglas técnicas

- **Scripts clásicos, no módulos ES.** Los handlers inline (`onclick="switchTab(...)"`) necesitan funciones globales, y `type="module"` rompería la apertura por `file://`. Los `const`/`let` de nivel superior se comparten entre ficheros.
- **El orden de `<script>` en `index.html` importa:** datos ➔ funciones ➔ `main.js`. Un fichero nuevo va antes de `main.js`, y su `init`/`render` se llama desde `main.js`.
- **Contenido estático vs. generado.** Los contenedores con `<!-- Injected via JavaScript -->` (`#itinerary-cards-container`, `#cities-table-body`, `#transport-grid`, `#activities-grouped-container`, modales) se rellenan desde `js/data/`. Los Tabs 1, 5 (tabla superior), 7 y 8 son HTML escrito a mano en `index.html`.
- **Tema claro = por defecto.** Se activa con `body.light-theme`, que sobrescribe las clases oscuras de Tailwind (`bg-slate-900`, `text-white`, `text-amber-400`…) en `css/styles.css`. Si usas una clase de color nueva y se ve mal en modo claro, añade el override allí.
- **localStorage:** `mototrip_theme`, `mototrip_favorites` (claves = `activity.name`, así que renombrar una actividad borra su favorito), `mototrip_packing` (claves = `id` del checkbox; cada `<input>` nuevo necesita un `id` único `pack-*`).
- **Formato de números:** es-ES (`1.950 km`, `525,60 €`). En código usa `formatEuro()` de `budget.js` o `toLocaleString('es-ES')`.
- **IDs de categorías de actividades:** `id="act-cat-<type>"` debe coincidir exactamente con `activity.type` (incluidos espacios y tildes).

## Forma de los datos

`daysData[i]`: `day, date, title, km, highwayKm, secondaryKm, time, mode, region, regionColor, isFerry, cities[], hotel, parkingType, activities[], pranzo, summary, gmaps, timeline[{time, act}]`; opcionales en días de ferry: `vessel, checkin, departure, arrival, isShortFerry`. Los km son strings (`"75 km"`).

`activitiesData[i]`: `name, type, region, location, lat, lng, bestTime, price, duration, gmaps, history, tips`. `type` ∈ `Termas | Arqueología y ruinas | Ruta en moto | Paisaje y naturaleza | Paisaje y cultura`. El filtro "Gratis" muestra las actividades cuyo `price` contiene "gratis" (sin distinguir mayúsculas).

## ⚠️ Datos duplicados: revisar al cambiar fechas, precios o km

Muchas cifras están repetidas a mano. Si cambias un ferry, una fecha o un total, busca (`grep`) y actualiza **todos** estos sitios:

| Dato | Dónde aparece |
|---|---|
| Precios/horarios de ferry | `index.html` (badge de cabecera, calendario, 4 tarjetas del Tab 1, tabla del Tab 5, desglose del Tab 4), `ferries.js`, `days.js`, `budgetDefaults` en `budget.js` |
| Km totales / horas | Cabecera y "Resumen rápido" en `index.html`, `routeKm` en `budget.js` y slider `#route-km-slider`, `km` en `days.js` |
| Fechas del viaje | Cabecera, calendario del Tab 1, `date` en `days.js`, `ferries.js` |
| Noches de hotel | `hotelNights` en `budget.js`, textos del Tab 4, tabla del Tab 8 |

Ya existen incoherencias conocidas (p. ej. 1.950 km en la cabecera vs. 1.865 km en el resumen; la tabla de alojamientos del Tab 8 lista 14 noches para un viaje de 12 días). No las "arregles" sin preguntar: confirma con el usuario cuál es el valor correcto.

## Cómo probar

No hay tests. Sirve la carpeta y abre el navegador (abrir `index.html` con doble clic también funciona):

```bash
python -m http.server 8000
```

Comprueba que la consola no tenga errores, que cada pestaña se renderice y que el modo claro y el oscuro se vean bien, también en ancho de móvil (<768px). La configuración `static` de `.claude/launch.json` lanza este mismo servidor.

## Git

Commits pequeños con mensajes cortos (el historial usa palabras sueltas en español: `Precios`, `Dias`, `actividades`). Rama `main`.
