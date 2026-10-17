// Renderizar tabla de ciudades (Tab 3) con pie de totales formal
function renderCitiesTable() {
  const body = document.getElementById('cities-table-body');
  if (!body) return;
  body.innerHTML = '';

  daysData.forEach(d => {
    const row = document.createElement('tr');
    row.className = "hover:bg-slate-900/60 transition-all border-b border-slate-800/40";
    row.innerHTML = `
      <td class="p-3 font-bold text-amber-400 whitespace-nowrap">Día ${d.day}</td>
      <td class="p-3 whitespace-nowrap">
        <span class="badge-pill text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase whitespace-nowrap ${d.regionColor}">${d.region}</span>
      </td>
      <td class="p-3 font-medium text-white whitespace-nowrap">${d.cities[0]}</td>
      <td class="p-3 text-slate-400 min-w-[200px]">${d.cities.slice(1, -1).join(' ➔ ')}</td>
      <td class="p-3 font-medium text-emerald-400 whitespace-nowrap">${d.cities[d.cities.length - 1]}</td>
      <td class="p-3 text-right font-mono text-amber-300 font-bold whitespace-nowrap">${d.km}</td>
      <td class="p-3 text-right font-mono text-blue-400 whitespace-nowrap">${d.highwayKm}</td>
      <td class="p-3 text-right font-mono text-emerald-400 whitespace-nowrap">${d.secondaryKm}</td>
      <td class="p-3 text-right font-mono text-slate-300 whitespace-nowrap">
        <a href="${d.gmaps}" target="_blank" class="text-amber-400 underline font-semibold hover:text-amber-300">Abrir GPS ➔</a>
      </td>
    `;
    body.appendChild(row);
  });

  const table = body.closest('table');
  if (table) {
    let tfoot = table.querySelector('tfoot');
    if (!tfoot) {
      tfoot = document.createElement('tfoot');
      tfoot.className = "bg-slate-950 border-t-2 border-amber-500/50 font-bold text-xs";
      table.appendChild(tfoot);
    }
    tfoot.innerHTML = `
      <tr class="text-slate-200">
        <td class="p-3 font-black text-amber-400" colspan="2">TOTAL EXPEDICIÓN</td>
        <td class="p-3 text-slate-300" colspan="3">12 Etapas (1.915 km en moto + 4 travesías oficiales)</td>
        <td class="p-3 text-right font-mono text-amber-400 font-black text-sm whitespace-nowrap">1.915 km</td>
        <td class="p-3 text-right font-mono text-blue-400 font-bold whitespace-nowrap">595 km (31%)</td>
        <td class="p-3 text-right font-mono text-emerald-400 font-bold whitespace-nowrap">1.320 km (69%)</td>
        <td class="p-3 text-right font-mono whitespace-nowrap">
          <a href="https://www.google.com/maps/dir/Lloret+de+Mar/Barcelona/Civitavecchia/Amalfi/Paestum/Scilla/Taormina/Etna/Agrigento/Segesta/Palermo/Cagliari/Baunei/Alghero/Porto+Torres/Barcelona/Lloret+de+Mar" target="_blank" class="inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all">🗺️ Ruta Total ➔</a>
        </td>
      </tr>
    `;
  }
}

