// Navegación por pestañas, modales y tema claro/oscuro

// Tab Switcher
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById('view-' + tabId).classList.remove('hidden');
  document.getElementById('tab-' + tabId).classList.add('active');

  if (tabId === 'map-view' && window.map) {
    setTimeout(() => { window.map.invalidateSize(); }, 200);
  }
  if (tabId === 'activities-view' && window.activitiesMap) {
    setTimeout(() => { window.activitiesMap.invalidateSize(); }, 200);
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

// Selector de tema claro / oscuro con persistencia
function applyTheme(theme) {
  const body = document.body;
  const btn = document.getElementById('theme-toggle-btn');
  if (theme === 'light') {
    body.classList.add('light-theme');
    if (btn) {
      btn.innerHTML = '☀️ <span>Modo claro</span>';
      btn.className = 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm';
    }
  } else {
    body.classList.remove('light-theme');
    if (btn) {
      btn.innerHTML = '🌙 <span>Modo oscuro</span>';
      btn.className = 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm';
    }
  }
}

function toggleTheme() {
  const isCurrentlyLight = document.body.classList.contains('light-theme');
  const newTheme = isCurrentlyLight ? 'dark' : 'light';
  applyTheme(newTheme);
  localStorage.setItem('mototrip_theme', newTheme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('mototrip_theme') || 'light';
  applyTheme(savedTheme);
}
