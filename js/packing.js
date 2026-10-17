// Persistencia y gestión de la lista de equipaje (Checklist)
function initPackingChecklist() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('mototrip_packing') || '{}');
  } catch (e) {
    saved = {};
  }
  const checkboxes = document.querySelectorAll('#view-packing-view input[type="checkbox"]');
  checkboxes.forEach(cb => {
    if (cb.id && saved[cb.id] !== undefined) {
      cb.checked = !!saved[cb.id];
    }
    cb.addEventListener('change', () => {
      savePackingChecklist();
      updatePackingProgress();
    });
  });
  updatePackingProgress();
}

function updatePackingProgress() {
  const checkboxes = document.querySelectorAll('#view-packing-view input[type="checkbox"]');
  const total = checkboxes.length;
  if (!total) return;
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const percent = Math.round((checked / total) * 100);

  const textEl = document.getElementById('packing-progress-text');
  if (textEl) {
    textEl.innerText = `${checked} de ${total} elementos (${percent}%)`;
  }
  const barEl = document.getElementById('packing-progress-bar');
  if (barEl) {
    barEl.style.width = `${percent}%`;
  }
}

function savePackingChecklist() {
  const state = {};
  const checkboxes = document.querySelectorAll('#view-packing-view input[type="checkbox"]');
  checkboxes.forEach(cb => {
    if (cb.id) {
      state[cb.id] = cb.checked;
    }
  });
  localStorage.setItem('mototrip_packing', JSON.stringify(state));
}

function resetPackingChecklist() {
  if (confirm('¿Estás seguro de que deseas restablecer la lista de equipaje? Se desmarcarán todos los elementos.')) {
    const checkboxes = document.querySelectorAll('#view-packing-view input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
    });
    localStorage.removeItem('mototrip_packing');
    updatePackingProgress();
  }
}
