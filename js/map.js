// Inicializar mapa con teselas CartoDB / Esri WorldTopoMap
function initMap() {
  const map = L.map('map').setView([39.0, 12.5], 6);
  window.map = map;

  // 100% Gratis Public Esri WorldTopoMap (No API key, No 403 blocks)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    maxZoom: 18
  }).addTo(map);

  const waypoints = [
    { name: "Lloret de Mar (Casa)", lat: 41.7005, lng: 2.8456, day: 1, desc: "Punto de salida y regreso de la expedición" },
    { name: "Puerto de Barcelona (Terminal Grimaldi)", lat: 41.368, lng: 2.175, day: 1, desc: "Embarque motos Ferry 1 hacia Civitavecchia" },
    { name: "Civitavecchia (Puerto de Roma)", lat: 42.092, lng: 11.796, day: 2, desc: "Desembarque 19:00 y pernocta en Santa Severa" },
    { name: "Costa Amalfitana (SS163)", lat: 40.634, lng: 14.602, day: 3, desc: "Carretera costera mítica de curvas y acantilados" },
    { name: "Paestum (Templos Griegos)", lat: 40.421, lng: 15.005, day: 3, desc: "Templos dóricos y pernocta en agriturismo vallado" },
    { name: "Terme di Caronte (Calabria)", lat: 38.973, lng: 16.291, day: 4, desc: "Pozas termales sulfurosas naturales a 39 °C" },
    { name: "Scilla (Chianalea)", lat: 38.254, lng: 15.717, day: 4, desc: "Pueblo marinero histórico en el Estrecho de Mesina" },
    { name: "Villa San Giovanni (Caronte)", lat: 38.220, lng: 15.635, day: 5, desc: "Ferry lanzadera 24h al cruce de Sicilia (20 min)" },
    { name: "Mesina (Sicilia)", lat: 38.200, lng: 15.560, day: 5, desc: "Llegada a Sicilia y enlace hacia el volcán Etna" },
    { name: "Vuelta SP92 al Etna (1.900 m)", lat: 37.702, lng: 15.000, day: 5, desc: "Ruta volcánica entre campos de lava y cráteres" },
    { name: "Valle de los Templos e Ícaro", lat: 37.288, lng: 13.586, day: 6, desc: "Templos griegos UNESCO y escultura de bronce" },
    { name: "Terme Segestane (río termal)", lat: 37.973, lng: 12.839, day: 6, desc: "Baño en río termal salvaje de aguas termales a 44 °C" },
    { name: "Puerto de Palermo", lat: 38.127, lng: 13.369, day: 7, desc: "Puerto de Palermo · Ferry diurno a Cagliari (09:00–21:00)" },
    { name: "Puerto de Cagliari (Cerdeña)", lat: 39.215, lng: 9.112, day: 7, desc: "Llegada a las 21:00 del ferry diurno MV Europa Palace" },
    { name: "SS125 Orientale Sarda (Baunei)", lat: 40.031, lng: 9.664, day: 8, desc: "El santuario de curvas con mejor asfalto de Europa" },
    { name: "Alghero & Capo Caccia", lat: 40.558, lng: 8.319, day: 9, desc: "Ciudad medieval costera catalana y acantilados" },
    { name: "Porto Torres (Ferry a Barcelona)", lat: 40.836, lng: 8.402, day: 11, desc: "Embarque 08:00 AM en el MV Cruise Roma de vuelta" }
  ];

  // 1. Tramos Terrestres en Moto (Polilínea continua ámbar #f59e0b)
  const motoLegs = [
    // Cataluña: Lloret -> Barcelona
    [[41.7005, 2.8456], [41.368, 2.175]],
    // Península: Civitavecchia -> Costa Amalfitana -> Paestum -> Terme di Caronte -> Scilla -> Villa San Giovanni
    [[42.092, 11.796], [40.634, 14.602], [40.421, 15.005], [38.973, 16.291], [38.254, 15.717], [38.220, 15.635]],
    // Sicilia: Mesina -> Etna -> Agrigento -> Segesta -> Palermo
    [[38.200, 15.560], [37.702, 15.000], [37.288, 13.586], [37.973, 12.839], [38.127, 13.369]],
    // Cerdeña: Cagliari -> Baunei SS125 -> Alghero -> Porto Torres
    [[39.215, 9.112], [40.031, 9.664], [40.558, 8.319], [40.836, 8.402]],
    // Regreso: Barcelona -> Lloret
    [[41.368, 2.175], [41.7005, 2.8456]]
  ];

  motoLegs.forEach(leg => {
    L.polyline(leg, { color: '#f59e0b', weight: 4, opacity: 0.9 }).addTo(map);
  });

  // 2. Travesías Marítimas en Ferry (Polilínea discontinua azul marino #0284c7)
  const ferryLegs = [
    // Ferry 1: Barcelona -> Civitavecchia (Nocturno)
    [[41.368, 2.175], [42.092, 11.796]],
    // Ferry 2: Villa San Giovanni -> Mesina (Estrecho lanzadera)
    [[38.220, 15.635], [38.200, 15.560]],
    // Ferry 3: Palermo -> Cagliari (Diurno 12h)
    [[38.127, 13.369], [39.215, 9.112]],
    // Ferry 4: Porto Torres -> Barcelona (15h)
    [[40.836, 8.402], [41.368, 2.175]]
  ];

  ferryLegs.forEach(leg => {
    L.polyline(leg, { color: '#0284c7', weight: 3, dashArray: '8, 8', opacity: 0.85 }).addTo(map);
  });

  // 3. Marcadores y Popups Enriquecidos con Botón Directo al Día
  waypoints.forEach(wp => {
    const isFerryPoint = wp.name.includes("Ferry") || wp.name.includes("Puerto");
    const markerColor = isFerryPoint ? "#0284c7" : "#f59e0b";

    const popupHtml = `
      <div class="space-y-1.5 p-1 min-w-[200px] text-xs">
        <strong class="text-sm font-bold text-slate-900 block leading-tight">${wp.name}</strong>
        <span class="text-slate-600 block text-[11px] leading-relaxed">${wp.desc}</span>
        ${wp.day ? `
          <div class="pt-1">
            <button onclick="openHourlyModal(${wp.day})" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] transition-all text-center">
              📅 Ver Cronograma Día ${wp.day} ➔
            </button>
          </div>
        ` : ''}
      </div>
    `;

    L.marker([wp.lat, wp.lng])
      .addTo(map)
      .bindPopup(popupHtml);
  });
}
