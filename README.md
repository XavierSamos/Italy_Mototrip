# MotoTrip Planner

Planificador estático de un viaje en moto padre e hijo (2 motos DCT) por Italia: **Lloret de Mar → Roma → Sicilia → Cerdeña** (9‑20 noviembre 2026).

## Tecnologías
- HTML clásico (sin módulos ES) + Tailwind CSS (CDN) + Leaflet 1.9.4 (CDN)
- Sin proceso de *build* ni npm.
- Todas las interacciones están en JavaScript tradicional cargado mediante `<script src="…">`.

## Estructura del proyecto
```
index.html            → Marcado de las 8 pestañas y los 2 modales
css/styles.css        → Estilos propios, overrides de tema claro y dark
js/data/*.js          → datos de días, actividades, ferrys
js/*.js               → lógica de la app (core, mapa, itinerario, presupuesto,…)
```

## Nuevas funcionalidades (versión final)
- **Impresión Road‑book**: botón en la cabecera que abre el diálogo de impresión; cada día se pagína en su propia hoja.
- **Filtro por región** (pestaña 2): pills para filtrar el itinerario por región con estilo de alto contraste.
- **Alertas de combustible y altitud**: badges en tarjetas de itinerario y modal horario cuando el consumo supera 200 km o la altitud supera 1 000 m.
- **Compartir por WhatsApp**: botón junto al selector de modo de presupuesto que copia al portapapeles un resumen listo para enviar.
- **Checklist de equipaje**: barra de progreso que se actualiza en tiempo real y persiste en `localStorage`.
- **Tarjeta de emergencias / normas de tráfico italianas** (pestaña 7).
- **Tema claro por defecto** con overrides que cumplen WCAG AA (contraste mínimo 4.5:1).
- **Persistencia** de tema, favoritos y checklist mediante `localStorage` (`mototrip_theme`, `mototrip_favorites`, `mototrip_packing`).

## Uso
```bash
# Servir de forma local (opcional)
python -m http.server 8000
# Luego abrir en el navegador
open http://localhost:8000/index.html   # o doble‑clic en index.html
```

## Contribuir
1. Clonar el repositorio.
2. Crear una rama descriptiva (`git checkout -b feature/…`).
3. Modificar los archivos dentro de `js/` o `css/` manteniendo la arquitectura sin módulos.
4. Probar localmente con `python -m http.server`.
5. Commit con mensaje breve en español.

## Licencia
Este proyecto está bajo licencia MIT.
