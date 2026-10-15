// Inicializar mapa con teselas CartoDB Voyager
function initMap() {
  const map = L.map('map').setView([39.0, 12.5], 6);
  window.map = map;

  // 100% Gratis Public Esri WorldTopoMap (No API key, No 403 blocks)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    maxZoom: 18
  }).addTo(map);

  const waypoints = [
    { name: "Lloret de Mar (Casa)", lat: 41.7005, lng: 2.8456, desc: "Punto de salida y llegada" },
    { name: "Puerto de Barcelona (Ferry)", lat: 41.368, lng: 2.175, desc: "Puerto de ferry de Grimaldi Lines" },
    { name: "Civitavecchia (Puerto de Roma)", lat: 42.092, lng: 11.796, desc: "Puerto de entrada a Italia continental" },
    { name: "Costa Amalfitana (SS163)", lat: 40.634, lng: 14.602, desc: "Carretera costera icónica para moto" },
    { name: "Terme di Caronte (Calabria)", lat: 38.973, lng: 16.291, desc: "Termas sulfurosas naturales" },
    { name: "Bronces de Riace (Reggio Calabria)", lat: 38.114, lng: 15.651, desc: "Esculturas griegas de bronce del siglo V a. C." },
    { name: "Vuelta SP92 al Etna", lat: 37.702, lng: 15.000, desc: "Ruta volcánica entre campos de lava (1.900 m)" },
    { name: "Valle de los Templos e Ícaro", lat: 37.288, lng: 13.586, desc: "Templos griegos y escultura de bronce" },
    { name: "Terme Segestane (río termal)", lat: 37.973, lng: 12.839, desc: "Baño en río termal natural a 47 °C" },
    { name: "Puerto de Palermo (ferry a Cerdeña)", lat: 38.127, lng: 13.369, desc: "Ferry nocturno a Cagliari" },
    { name: "Puerto de Cagliari (Cerdeña)", lat: 39.215, lng: 9.112, desc: "Punto de salida en Cerdeña" },
    { name: "SS125 Orientale Sarda (Baunei)", lat: 40.031, lng: 9.664, desc: "Puerto de montaña legendario con mucho agarre" },
    { name: "Alghero & Capo Caccia", lat: 40.558, lng: 8.319, desc: "Ciudad medieval costera y carretera de acantilados" },
    { name: "Porto Torres (Ferry to Barcelona)", lat: 40.836, lng: 8.402, desc: "Puerto de ferry directo de regreso a España" }
  ];

  const latlngs = waypoints.map(wp => [wp.lat, wp.lng]);
  L.polyline(latlngs, { color: '#f59e0b', weight: 4, opacity: 0.85, dashArray: '6, 6' }).addTo(map);

  waypoints.forEach(wp => {
    L.marker([wp.lat, wp.lng])
      .addTo(map)
      .bindPopup(`<b style="color:#0f172a;">${wp.name}</b><br><span style="font-size:12px; color:#475569;">${wp.desc}</span>`);
  });
}
