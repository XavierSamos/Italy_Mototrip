// Desglose de ferrys y tramos en moto (Tab 5)

function renderFerryCard(ferry, index) {
  return '<div class="card-box bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm">' +
      '<div class="flex flex-wrap justify-between items-start gap-3">' +
        '<div class="space-y-1">' +
          '<span class="text-[10px] px-2.5 py-1 rounded-full border font-black tracking-wider ' + ferry.color + '">' + ferry.badge + '</span>' +
          '<h3 class="font-bold text-white text-base mt-2">' + (index + 1) + '. ' + ferry.route + '</h3>' +
          '<p class="text-xs text-slate-400">' + ferry.company + ' • Buque: <strong class="text-slate-200">' + ferry.vessel + '</strong></p>' +
        '</div>' +
        '<span class="bg-slate-900 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs font-bold">' + ferry.deck + '</span>' +
      '</div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">' +
        '<div class="bg-slate-900 border border-slate-800 rounded-xl p-3"><span class="text-slate-400 block text-[11px]">Salida</span><strong class="text-amber-300 font-mono">' + ferry.departure + '</strong></div>' +
        '<div class="bg-slate-900 border border-slate-800 rounded-xl p-3"><span class="text-slate-400 block text-[11px]">Llegada</span><strong class="text-emerald-300 font-mono">' + ferry.arrival + '</strong></div>' +
        '<div class="bg-slate-900 border border-slate-800 rounded-xl p-3"><span class="text-slate-400 block text-[11px]">Duración</span><strong class="text-blue-300 font-mono">⏱️ ' + ferry.duration + '</strong></div>' +
      '</div>' +
      '<div class="flex flex-wrap gap-2 text-xs">' +
        '<span class="bg-red-500/10 text-red-300 border border-red-500/30 rounded-full px-3 py-1 font-bold">⚠️ Check-in: ' + ferry.checkin + '</span>' +
        '<span class="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full px-3 py-1 font-bold">💶 Tarifa confirmada: ' + ferry.price + '</span>' +
        '<span class="bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-full px-3 py-1 font-bold">Camarote doble incluido</span>' +
      '</div>' +
      '<div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 leading-relaxed space-y-1.5">' +
        '<strong class="text-amber-400 block">Consejos de amarre y Protocolo DCT en bodega:</strong>' +
        '<p class="text-slate-300">🔒 <strong>Motos Honda DCT (Africa Twin y NC750X):</strong> Al apagar el contacto quedan en neutro mecánico. Es <u>OBLIGATORIO accionar la palanca del freno de mano mecánico</u> en el semimanillar izquierdo antes de atar.</p>' +
        '<p class="text-slate-300">Llevar cincha propia corta o soft-loop, apoyar sobre pata lateral (no caballete central), proteger asiento/carenado con un trapo y revisar la tensión de las cinchas antes de subir al camarote.</p>' +
      '</div>' +
    '</div>';
}

// Renderizar desglose de transporte (Tab 5) - ferrys y tramos en moto
function renderTransportGrid() {
  const grid = document.getElementById('transport-grid');
  const ferryHtml = ferriesData.map((ferry, index) => renderFerryCard(ferry, index)).join('');
  const regions = ["España", "Italia continental", "Sicilia", "Cerdeña"];
  let motorbikeHtml = '';

  regions.forEach(reg => {
    const legs = daysData.filter(d => d.region === reg);
    if (legs.length === 0) return;

    let badgeColor = "bg-red-500/20 text-red-300 border-red-500/40";
    if (reg === "Italia continental") badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    if (reg === "Sicilia") badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    if (reg === "Cerdeña") badgeColor = "bg-sky-500/20 text-sky-300 border-sky-500/40";

    motorbikeHtml += '<div class="mb-4"><div class="flex items-center gap-2 mb-2"><span class="text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ' + badgeColor + '">' + reg + '</span><span class="text-xs text-slate-400">(' + legs.length + ' días)</span></div><ul class="text-xs space-y-1.5 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">';

    legs.forEach(l => {
      motorbikeHtml += '<li class="flex justify-between items-center py-1.5 border-b border-slate-800/40 last:border-none text-xs gap-3"><span><strong class="text-slate-200">Día ' + l.day + ':</strong> ' + l.title + '</span><div class="flex items-center gap-2 font-mono shrink-0"><span class="text-blue-400 text-[11px]">🛣️ ' + l.highwayKm + '</span><span class="text-emerald-400 text-[11px]">🏍️ ' + l.secondaryKm + '</span><span class="text-amber-300 font-bold ml-1">' + l.km + '</span></div></li>';
    });

    motorbikeHtml += '</ul></div>';
  });

  grid.innerHTML = '<div class="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">' + ferryHtml + '</div><div class="xl:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4"><h3 class="font-bold text-md text-amber-400 flex items-center gap-2">🏍️ Tramos en moto (agrupados por región)</h3>' + motorbikeHtml + '</div>';
}
