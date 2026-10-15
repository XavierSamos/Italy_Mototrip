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
    cb.addEventListener('change', savePackingChecklist);
  });
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
  }
}
