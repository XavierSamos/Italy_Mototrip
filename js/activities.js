// Actividades: filtros, favoritos, mapa y modal (Tab 6)

let currentActivityCategory = 'ALL';

function setActivityCategory(cat) {
  currentActivityCategory = cat;
  document.querySelectorAll('.act-cat-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
    btn.classList.add('bg-slate-950', 'border-slate-700');
  });

  const activeBtn = document.getElementById('act-cat-' + cat);
  if (activeBtn) {
    activeBtn.classList.remove('bg-slate-950', 'border-slate-700');
    activeBtn.classList.add('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
  }

  renderActivitiesGrouped();
}

// Gestión y Persistencia de Actividades Favoritas (localStorage)
let favoritesState = {};
let currentModalAct = null;

function initFavorites() {
  try {
    favoritesState = JSON.parse(localStorage.getItem('mototrip_favorites') || '{}');
  } catch (e) {
    favoritesState = {};
  }
  updateFavoritesCount();
}

function isFavorite(actName) {
  return !!favoritesState[actName];
}

function toggleFavorite(actName) {
  if (favoritesState[actName]) {
    delete favoritesState[actName];
  } else {
    favoritesState[actName] = true;
  }
  localStorage.setItem('mototrip_favorites', JSON.stringify(favoritesState));
  updateFavoritesCount();
  renderActivitiesGrouped();

  if (currentModalAct && currentModalAct.name === actName) {
    updateModalFavButton();
  }
}

function toggleFavoriteFromModal() {
  if (currentModalAct) {
    toggleFavorite(currentModalAct.name);
  }
}

function updateModalFavButton() {
  const btn = document.getElementById('modal-fav-btn');
  if (!btn || !currentModalAct) return;
  const fav = isFavorite(currentModalAct.name);
  if (fav) {
    btn.innerHTML = '⭐ <span>Guardado en Favoritos</span>';
    btn.className = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm';
  } else {
    btn.innerHTML = '☆ <span>Añadir a Favoritos</span>';
    btn.className = 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm';
  }
}

function updateFavoritesCount() {
  const count = Object.keys(favoritesState).length;
  const countEl = document.getElementById('fav-count');
  if (countEl) countEl.innerText = count;
}

// Mapa interactivo colapsable para Actividades (Tab 6)
window.activitiesMap = null;
window.activitiesMarkersLayer = null;

function initActivitiesMap() {
  if (window.activitiesMap) return;
  const mapContainer = document.getElementById('activities-map');
  if (!mapContainer) return;

  window.activitiesMap = L.map('activities-map').setView([38.5, 13.0], 6);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  }).addTo(window.activitiesMap);

  window.activitiesMarkersLayer = L.layerGroup().addTo(window.activitiesMap);
}

function toggleActivitiesMap() {
  const wrapper = document.getElementById('activities-map-wrapper');
  const textEl = document.getElementById('activities-map-toggle-text');
  const arrowEl = document.getElementById('activities-map-toggle-arrow');
  if (!wrapper) return;

  const isHidden = wrapper.classList.contains('hidden');
  if (isHidden) {
    wrapper.classList.remove('hidden');
    if (textEl) textEl.innerText = 'Plegar mapa';
    if (arrowEl) arrowEl.innerText = '🔺';
    
    initActivitiesMap();
    setTimeout(() => {
      if (window.activitiesMap) {
        window.activitiesMap.invalidateSize();
        renderActivitiesGrouped();
      }
    }, 100);
  } else {
    wrapper.classList.add('hidden');
    if (textEl) textEl.innerText = 'Desplegar mapa';
    if (arrowEl) arrowEl.innerText = '🔻';
  }
}

function getEmojiMarkerIcon(type, isFav) {
  let emoji = "📍";
  let bg = "bg-amber-500 border-amber-300";
  if (type === "Termas") { emoji = "♨️"; bg = "bg-emerald-500 border-emerald-300"; }
  else if (type === "Arqueología y ruinas") { emoji = "🏛️"; bg = "bg-amber-500 border-amber-300"; }
  else if (type === "Ruta en moto") { emoji = "🏍️"; bg = "bg-sky-500 border-sky-300"; }
  else if (type === "Paisaje y naturaleza") { emoji = "🌅"; bg = "bg-purple-500 border-purple-300"; }
  else if (type === "Paisaje y cultura") { emoji = "🏰"; bg = "bg-rose-500 border-rose-300"; }

  const starBadge = isFav ? '<span class="absolute -top-1.5 -right-1.5 text-xs filter drop-shadow">⭐</span>' : '';

  return L.divIcon({
    className: 'custom-emoji-marker',
    html: `<div class="relative ${bg} text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-md transform hover:scale-125 transition-all cursor-pointer">${emoji}${starBadge}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function updateActivitiesMap(filteredActivities) {
  const countEl = document.getElementById('map-active-count');
  if (countEl) {
    countEl.innerText = `${filteredActivities.length} ${filteredActivities.length === 1 ? 'marcador' : 'marcadores'}`;
  }

  if (!window.activitiesMap || !window.activitiesMarkersLayer) return;

  window.activitiesMarkersLayer.clearLayers();

  const boundsCoords = [];

  filteredActivities.forEach(act => {
    if (act.lat && act.lng) {
      boundsCoords.push([act.lat, act.lng]);
      const fav = isFavorite(act.name);
      const icon = getEmojiMarkerIcon(act.type, fav);
      const marker = L.marker([act.lat, act.lng], { icon });
      const safeName = act.name.replace(/'/g, "\\'");
      const popupContent = `
        <div class="space-y-1.5 text-xs text-slate-800 p-1 min-w-[200px]">
          <strong class="font-bold text-sm text-slate-900 block leading-tight">${act.name}</strong>
          <div class="text-[11px] text-slate-600">📍 ${act.location}</div>
          <div class="font-bold text-amber-700 font-mono text-[11px]">${act.price}</div>
          <div class="pt-1 flex flex-col gap-1">
            <button onclick="openActivityByName('${safeName}')" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] transition-all text-center">
              🔍 Ver detalles y consejos ➔
            </button>
            <a href="${act.gmaps}" target="_blank" class="w-full text-center bg-slate-100 border border-slate-300 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px] hover:bg-slate-200">
              🗺️ Google Maps GPS ➔
            </a>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
      window.activitiesMarkersLayer.addLayer(marker);
    }
  });

  if (boundsCoords.length > 0) {
    const bounds = L.latLngBounds(boundsCoords);
    window.activitiesMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }
}

function openActivityByName(actName) {
  const act = activitiesData.find(a => a.name === actName);
  if (act) {
    openActivityModal(act);
  }
}

// Vinculación bidireccional Actividades ↔ Itinerario Diario
function getActivityDayInfo(actName) {
  if (typeof daysData === 'undefined' || !Array.isArray(daysData)) return null;
  const clean = str => str.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/gi, '');
  const target = clean(actName);
  for (const d of daysData) {
    if (d.activities && d.activities.length > 0) {
      for (const act of d.activities) {
        const aClean = clean(act);
        if (aClean === target || aClean.includes(target) || target.includes(aClean)) {
          return { day: d.day, title: d.title };
        }
      }
    }
  }
  return null;
}

function goToDayItinerary(dayNum) {
  if (typeof switchTab === 'function') {
    switchTab('itinerary-view');
  }
  if (typeof closeModal === 'function') {
    closeModal('activity-modal');
  }
  setTimeout(() => {
    if (typeof openHourlyModal === 'function') {
      openHourlyModal(dayNum);
    }
    const container = document.getElementById('itinerary-cards-container');
    if (container && container.children && container.children[dayNum - 1]) {
      container.children[dayNum - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 180);
}

// Renderizar actividades agrupadas por categoría y región (Tab 6)
function renderActivitiesGrouped() {
  const container = document.getElementById('activities-grouped-container');
  container.innerHTML = '';

  const searchVal = document.getElementById('activity-search').value.toLowerCase();

  // Filtrar datos por categoría y búsqueda
  const filtered = activitiesData.filter(a => {
    const isFav = isFavorite(a.name);
    const isFree = a.price.toLowerCase().includes('gratis');
    const matchesCat = (currentActivityCategory === 'ALL') || 
                       (currentActivityCategory === 'FAVORITES' ? isFav :
                        (currentActivityCategory === 'FREE' ? isFree : a.type === currentActivityCategory));
    const matchesSearch = a.name.toLowerCase().includes(searchVal) ||
                          a.type.toLowerCase().includes(searchVal) ||
                          a.location.toLowerCase().includes(searchVal) ||
                          a.history.toLowerCase().includes(searchVal);
    return matchesCat && matchesSearch;
  });

  updateActivitiesMap(filtered);

  if (filtered.length === 0) {
    if (currentActivityCategory === 'FAVORITES') {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <span class="text-4xl block">⭐</span>
          <h3 class="font-bold text-white text-base">Aún no tienes actividades en tus Favoritos</h3>
          <p class="text-xs text-slate-400 max-w-md mx-auto">Haz clic en el icono de estrella ⭐ de cualquier tarjeta o dentro del detalle de la actividad para marcar tus planes imprescindibles y filtrarlos rápidamente aquí.</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
          <span>No hay actividades que coincidan con tu búsqueda y filtro de categoría.</span>
        </div>
      `;
    }
    return;
  }

  // Agrupar actividades filtradas por tipo/categoría
  const categoryMap = {
    "Termas": { label: "♨️ Termas naturales y ríos termales", color: "border-emerald-500/40 text-emerald-400" },
    "Arqueología y ruinas": { label: "🏛️ Ruinas griegas y romanas y arqueología", color: "border-amber-500/40 text-amber-400" },
    "Ruta en moto": { label: "🏍️ Puertos de montaña y carreteras de acantilados en moto", color: "border-sky-500/40 text-sky-400" },
    "Paisaje y naturaleza": { label: "🌅 Miradores panorámicos, acantilados y cuevas", color: "border-purple-500/40 text-purple-400" },
    "Paisaje y cultura": { label: "🏰 Cascos antiguos medievales y monumentos UNESCO", color: "border-rose-500/40 text-rose-400" }
  };

  const grouped = {};
  filtered.forEach(act => {
    if (!grouped[act.type]) grouped[act.type] = [];
    grouped[act.type].push(act);
  });

  Object.keys(grouped).forEach(catKey => {
    const groupInfo = categoryMap[catKey] || { label: catKey, color: "text-white" };
    const actList = grouped[catKey];

    const section = document.createElement('div');
    section.className = "space-y-3";

    let cardsHtml = '';
    actList.forEach(a => {
      let regionBadge = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      if (a.region === "España") regionBadge = "bg-red-500/20 text-red-300 border-red-500/40";
      if (a.region === "Sicilia") regionBadge = "bg-amber-500/20 text-amber-300 border-amber-500/40";
      if (a.region === "Cerdeña") regionBadge = "bg-sky-500/20 text-sky-300 border-sky-500/40";

      const fav = isFavorite(a.name);
      const safeName = a.name.replace(/'/g, "\\'");
      const dayInfo = getActivityDayInfo(a.name);

      cardsHtml += `
        <div onclick='openActivityModal(${JSON.stringify(a).replace(/'/g, "&apos;")})' class="card-box bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/60 transition-all cursor-pointer shadow-sm flex flex-col justify-between">
          <div class="space-y-2">
            <!-- Header: Badges & Favorite Star -->
            <div class="flex justify-between items-start gap-2">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="badge-pill text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase ${regionBadge}">${a.region}</span>
                ${dayInfo ? `
                  <button type="button" onclick="event.stopPropagation(); goToDayItinerary(${dayInfo.day})" class="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full transition-all" title="Ver en Itinerario Día ${dayInfo.day}: ${dayInfo.title}">
                    📅 Día ${dayInfo.day}
                  </button>
                ` : ''}
              </div>
              <button onclick="event.stopPropagation(); toggleFavorite('${safeName}')" class="shrink-0 text-base leading-none p-1 rounded hover:bg-slate-800/80 transition-all ${fav ? 'text-amber-400 font-bold scale-110' : 'text-slate-500 hover:text-amber-400'}" title="${fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
                ${fav ? '⭐' : '☆'}
              </button>
            </div>

            <!-- Title -->
            <h4 class="font-bold text-sm text-white pt-1 leading-snug">${a.name}</h4>

            <!-- Location & Price Row (Prevents overflow) -->
            <div class="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-1.5 pt-0.5">
              <span class="truncate max-w-[210px]" title="${a.location}">📍 ${a.location}</span>
              <span class="font-mono text-amber-700 dark:text-amber-300 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded shrink-0">${a.price}</span>
            </div>

            <!-- Short History -->
            <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">${a.history}</p>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
            <a href="${a.gmaps}" target="_blank" onclick="event.stopPropagation();" class="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
              📍 Google Maps
            </a>
            <span class="text-amber-400 font-bold hover:underline">Detalles y consejos ➔</span>
          </div>
        </div>
      `;
    });

    section.innerHTML = `
      <div class="flex items-center gap-2 border-b border-slate-800 pb-2">
        <h3 class="font-bold text-sm uppercase ${groupInfo.color}">${groupInfo.label}</h3>
        <span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">(${actList.length})</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${cardsHtml}
      </div>
    `;

    container.appendChild(section);
  });
}

function filterActivities() {
  renderActivitiesGrouped();
}

function openActivityModal(act) {
  currentModalAct = act;
  document.getElementById('act-type-badge').innerText = act.type;
  
  // Enlace al día del itinerario si aplica
  const dayInfo = getActivityDayInfo(act.name);
  const dayBadgeEl = document.getElementById('act-day-badge');
  if (dayBadgeEl) {
    if (dayInfo) {
      dayBadgeEl.innerHTML = `
        <button type="button" onclick="goToDayItinerary(${dayInfo.day})" class="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full transition-all" title="Ver Día ${dayInfo.day} en Itinerario">
          📅 Día ${dayInfo.day}: ${dayInfo.title} ➔
        </button>
      `;
      dayBadgeEl.classList.remove('hidden');
    } else {
      dayBadgeEl.innerHTML = '';
      dayBadgeEl.classList.add('hidden');
    }
  }

  document.getElementById('act-title').innerText = act.name;
  document.getElementById('act-location').innerText = act.location;
  document.getElementById('act-history').innerText = act.history;
  document.getElementById('act-duration').innerText = act.duration;
  document.getElementById('act-price').innerText = act.price;
  document.getElementById('act-tips').innerText = act.tips;
  updateModalFavButton();

  const tipsContainer = document.getElementById('act-tips').parentElement;
  let gmapsLink = tipsContainer.querySelector('.gmaps-act-link');
  if (!gmapsLink) {
    gmapsLink = document.createElement('div');
    gmapsLink.className = "gmaps-act-link pt-2";
    tipsContainer.appendChild(gmapsLink);
  }
  gmapsLink.innerHTML = `
    <a href="${act.gmaps}" target="_blank" class="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold mt-1">
      📍 Abrir ${act.name} en Google Maps ➔
    </a>
  `;

  document.getElementById('activity-modal').classList.remove('hidden');
}
