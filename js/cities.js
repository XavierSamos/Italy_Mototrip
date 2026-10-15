// Renderizar tabla de ciudades (Tab 3)
function renderCitiesTable() {
  const body = document.getElementById('cities-table-body');
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
        <a href="${d.gmaps}" target="_blank" class="text-amber-400 underline font-semibold">Abrir GPS ➔</a>
      </td>
    `;
    body.appendChild(row);
  });
}
