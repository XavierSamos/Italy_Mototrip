// Variable de estado para el filtro de región en el itinerario
let currentItinFilter = 'ALL';

// Filtro interactivo por región para las tarjetas del itinerario
function filterItineraryByRegion(key) {
  currentItinFilter = key;
  const buttons = document.querySelectorAll('.itin-filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
    btn.classList.add('bg-slate-950', 'text-slate-400', 'border-slate-700');
  });
  const activeBtn = document.getElementById(`itin-filter-${key}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-slate-950', 'text-slate-400', 'border-slate-700');
    activeBtn.classList.add('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
  }

  let filtered = daysData;
  if (key === 'ESP') {
    filtered = daysData.filter(d => d.day === 1 || d.day === 12);
  } else if (key === 'PENINSULA') {
    filtered = daysData.filter(d => d.day === 2 || d.day === 3 || d.day === 4);
  } else if (key === 'SICILIA') {
    filtered = daysData.filter(d => d.day === 5 || d.day === 6);
  } else if (key === 'CERDENA') {
    filtered = daysData.filter(d => d.day === 8 || d.day === 9 || d.day === 10);
  } else if (key === 'FERRY') {
    filtered = daysData.filter(d => d.isFerry || d.isShortFerry);
  }
  renderItineraryCards(filtered);
}

// Renderizar tarjetas de itinerario (Tab 2) con diseño estructurado
function renderItineraryCards(daysToRender = daysData) {
  const container = document.getElementById('itinerary-cards-container');
  if (!container) return;
  container.innerHTML = '';
  daysToRender.forEach(d => {
    const card = document.createElement('div');
    card.className = "card-box bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-amber-500/60 transition-all cursor-pointer shadow-sm";
    card.onclick = () => openHourlyModal(d.day);

    // 🎯 Chips de Actividades del Día (clickables)
    let activitiesHtml = '';
    if (d.activities && d.activities.length > 0) {
      const chips = d.activities.map(actName => {
        const safeName = actName.replace(/'/g, "\\'");
        return `<button type="button" onclick="event.stopPropagation(); openActivityByName('${safeName}')" class="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105" title="Abrir ficha técnica de ${actName}">🎯 <span>${actName}</span></button>`;
      }).join(' ');
      activitiesHtml = `
        <div class="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span class="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">🎯 Visitas y curvas programadas:</span>
          <div class="flex flex-wrap gap-1.5">${chips}</div>
        </div>
      `;
    }

    // Bloque central: Día de Ferry vs Día de Carretera
    let middleBlockHtml = '';
    if (d.isFerry) {
      middleBlockHtml = `
        <div class="bg-slate-900 border border-amber-500/30 rounded-xl p-3.5 space-y-2 text-xs">
          <div class="flex flex-wrap justify-between items-center gap-2">
            <span class="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase">🚢 ${d.vessel || 'Travesía Grimaldi Lines'}</span>
            ${d.checkin ? `<span class="bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-black px-2.5 py-0.5 rounded-full">⏱️ Check-in: ${d.checkin}</span>` : ''}
          </div>
          <div class="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300 pt-1">
            <div><span class="text-slate-400 block text-[10px] uppercase font-sans">Salida programada</span><strong>⚓ ${d.departure || '—'}</strong></div>
            <div><span class="text-slate-400 block text-[10px] uppercase font-sans">Llegada a puerto</span><strong class="text-emerald-300">🏁 ${d.arrival || '—'}</strong></div>
          </div>
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-[11px] text-amber-200 leading-relaxed flex items-start gap-1.5">
            <span class="text-base shrink-0">🔒</span>
            <span><strong>Aviso DCT en Bodega:</strong> Al apagar el contacto las motos DCT quedan en neutro mecánico. <u>Es obligatorio accionar la palanca del freno de mano mecánico</u> en el semimanillar izquierdo y apoyar sobre la pata de cabra lateral.</span>
          </div>
        </div>
      `;
    } else {
      // Bloque de Carretera: Cronograma compacto & Pranzo de 2h
      middleBlockHtml = `
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>⏱️ Cronograma de Conducción Recomendado</span>
            <span class="text-amber-400 font-normal text-[10px]">Noviembre (Luz solar hasta 16:45)</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-300">
            <div class="flex items-center gap-1.5"><span>🌅 <strong>08:30</strong></span> <span>Salida matinal fresca</span></div>
            <div class="flex items-center gap-1.5"><span>☕ <strong>10:30</strong></span> <span>Pausa café espresso en ruta</span></div>
            <div class="flex items-start gap-1.5 sm:col-span-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span class="text-base shrink-0">🍝</span>
              <div>
                <strong class="text-amber-400 block text-[11px]">13:00 – 15:00 • Pausa Sagrada de Comida (Pranzo - 2h)</strong>
                <span class="text-emerald-300 font-medium">${d.pranzo || 'Plato típico regional y descanso de ruta'}</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5"><span>🏨 <strong>16:45 – 17:15</strong></span> <span class="text-amber-300 font-bold">Llegada hotel antes de anochecer</span></div>
            <div class="flex items-center gap-1.5"><span>🍕 <strong>20:00</strong></span> <span>Cena tradicional relajada</span></div>
          </div>
        </div>
      `;
    }

    // Alojamiento y Seguridad del Parking para Motos
    const hotelBlock = `
      <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs flex flex-wrap justify-between items-center gap-2">
        <div class="space-y-0.5">
          <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">🏨 Pernocta & Parking Seguro</span>
          <span class="text-slate-200 text-xs font-medium">${d.hotel}</span>
        </div>
        <span class="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap">${d.parkingType || '🔒 Garaje privado cerrado'}</span>
      </div>
    `;

    // Badges de alerta de altitud y repostaje
    let alertBadges = '';
    if (d.hasHighAltitude) {
      alertBadges += `<span class="badge-pill bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap" title="${d.altitudePass || 'Paso >1.000m'}">❄️ Puerto >1.000m (${d.day === 5 ? 'Etna 1.900m' : 'Gennargentu 1.245m'})</span>`;
    }
    if (d.hasFuelAlert) {
      alertBadges += `<span class="badge-pill bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap" title="Etapa >200km: Repostaje programado a mitad de jornada">⛽ Repostaje >200km</span>`;
    }

    card.innerHTML = `
      <div class="space-y-3.5">
        <!-- Header Badges -->
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-amber-400 font-black text-sm whitespace-nowrap">DÍA ${d.day}</span>
            <span class="badge-pill bg-slate-800 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">${d.date}</span>
            <span class="badge-pill text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase whitespace-nowrap ${d.regionColor}">${d.region}</span>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="day-km-badge badge-pill bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap">${d.km}</span>
            <span class="badge-pill bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap">⏱️ ${d.time}</span>
          </div>
        </div>

        <!-- Road Desglose Badges -->
        <div class="flex flex-wrap gap-1.5 text-[11px]">
          <span class="badge-pill bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">🛣️ Autopista: ${d.highwayKm}</span>
          <span class="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono whitespace-nowrap">🏍️ Secundaria: ${d.secondaryKm}</span>
          ${alertBadges}
        </div>

        <div>
          <h4 class="font-bold text-base text-white leading-snug">${d.title}</h4>
          <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1 overflow-x-auto whitespace-nowrap py-0.5">
            <span>📍</span> <span>${d.cities.join(' <span class="text-amber-400 font-bold">➔</span> ')}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed mt-2">${d.summary}</p>
        </div>

        ${middleBlockHtml}
        ${activitiesHtml}
        ${hotelBlock}
      </div>

      <div class="pt-3 border-t border-slate-800/80 flex flex-wrap justify-between items-center gap-2 text-xs">
        <a href="${d.gmaps}" target="_blank" onclick="event.stopPropagation();" class="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all">
          🗺️ Ruta en Google Maps
        </a>
        <span class="text-amber-400 font-bold hover:underline flex items-center gap-1">
          📋 Horario completo por horas ➔
        </span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Apertura de modales
function openHourlyModal(dayNum) {
  const data = daysData.find(d => d.day === dayNum);
  if (!data) return;

  document.getElementById('modal-day-badge').innerText = `DÍA ${data.day} • ${data.date} • ${data.region} • ${data.km} • ⏱️ ${data.time}`;
  document.getElementById('modal-title').innerText = data.title;

  const timelineContainer = document.getElementById('modal-timeline');

  let ferryHtml = '';
  if (data.isFerry) {
    ferryHtml = `
      <div class="bg-indigo-950/40 border-2 border-indigo-500/60 rounded-xl p-3.5 space-y-2 mb-3">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <span class="bg-indigo-500 text-white font-bold px-2.5 py-0.5 rounded text-[11px] tracking-wide uppercase flex items-center gap-1.5">
            🚢 ${data.vessel || 'Ferry Grimaldi / Caronte'}
          </span>
          <span class="text-rose-400 font-bold text-xs bg-rose-950/80 border border-rose-600/50 px-2 py-0.5 rounded">
            ⚠️ CHECK-IN MUELLE: ${data.checkin || '2h antes'}
          </span>
        </div>
        <div class="flex items-center justify-between text-xs text-slate-200">
          <span><strong>Salida:</strong> ${data.departure || '--:--'}</span>
          <span><strong>Llegada:</strong> ${data.arrival || '--:--'}</span>
        </div>
        <div class="text-[11px] bg-amber-500/10 border border-amber-500/30 rounded p-2 text-amber-300 flex items-start gap-1.5">
          <span>⚠️</span>
          <span><strong>Protocolo Honda DCT en Ferry:</strong> En motos automáticas DCT, parar motor deja la caja en neutro. Es <u>obligatorio accionar la palanca del freno de mano mecánico</u> (semimanillar izquierdo) al amarrar en bodega.</span>
        </div>
      </div>
    `;
  }

  let altitudeHtml = '';
  if (data.hasHighAltitude) {
    altitudeHtml = `
      <div class="bg-sky-950/30 border border-sky-500/40 rounded-xl p-3 text-xs text-sky-200 mb-3 flex items-start gap-2">
        <span class="text-base shrink-0">❄️</span>
        <div>
          <strong class="text-sky-300 block font-bold">Aviso de Altitud y Térmicos: ${data.altitudePass || 'Puerto >1.000m'}</strong>
          <span>En cotas superiores a 1.000 m en noviembre las temperaturas pueden descender de 8°C y el asfalto retiene humedad. Llevar sotocasco, guantes de invierno y membrana cortaviento a mano.</span>
        </div>
      </div>
    `;
  }

  let fuelHtml = '';
  if (data.hasFuelAlert) {
    fuelHtml = `
      <div class="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 mb-3 flex items-start gap-2">
        <span class="text-base shrink-0">⛽</span>
        <div>
          <strong class="text-amber-300 block font-bold">Gestión de Autonomía (>200 km):</strong>
          <span>Autonomía segura: Africa Twin ~275 km, NC750X ~255 km. Parada técnica de repostaje self-service programada a las 12:30. En la NC750X la boca de llenado está bajo el asiento del acompañante.</span>
        </div>
      </div>
    `;
  }

  let parkingHtml = '';
  if (data.parkingType || data.hotel) {
    parkingHtml = `
      <div class="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs mb-3">
        <span class="text-slate-300 font-medium">🏨 ${data.hotel || 'Alojamiento'}</span>
        <span class="badge-pill bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
          ${data.parkingType || '🔒 Garaje privado cerrado'}
        </span>
      </div>
    `;
  }

  let pranzoHtml = '';
  if (data.pranzo) {
    pranzoHtml = `
      <div class="bg-amber-950/20 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200 mb-3 flex items-center gap-2">
        <span class="text-base">🍝</span>
        <div>
          <strong>Pranzo típico (13:00 - 15:00):</strong> ${data.pranzo}
        </div>
      </div>
    `;
  }

  let activitiesHtml = '';
  if (data.activities && data.activities.length > 0) {
    activitiesHtml = `
      <div class="mb-3 space-y-1.5">
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">🎯 Actividades destacadas de la etapa (clic para ver detalles):</div>
        <div class="flex flex-wrap gap-1.5">
          ${data.activities.map(actName => {
            const safeName = actName.replace(/'/g, "\\'");
            return `<button type="button" onclick="openActivityByName('${safeName}')" class="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
              <span>✨</span> ${actName} ➔
            </button>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  let timelineItemsHtml = '';
  if (data.timeline && data.timeline.length > 0) {
    timelineItemsHtml = data.timeline.map(t => `
      <div class="flex gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
        <span class="font-mono text-amber-400 font-bold w-28 shrink-0">${t.time}</span>
        <span class="text-slate-300 leading-relaxed">${t.act}</span>
      </div>
    `).join('');
  }

  timelineContainer.innerHTML = `
    <div class="pb-1">
      <a href="${data.gmaps}" target="_blank" class="inline-flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-lg text-xs font-bold w-full transition-all">
        🗺️ Abrir ruta completa del Día ${data.day} en Google Maps ➔
      </a>
    </div>
    ${ferryHtml}
    ${altitudeHtml}
    ${fuelHtml}
    ${parkingHtml}
    ${pranzoHtml}
    ${activitiesHtml}
    <div class="space-y-1.5 pt-2 border-t border-slate-800">
      <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">⏱️ Cronograma Estimado de la Jornada:</div>
      <div class="space-y-2">
        ${timelineItemsHtml}
      </div>
    </div>
  `;

  document.getElementById('hourly-modal').classList.remove('hidden');
}
window.openDayModal = openHourlyModal;
