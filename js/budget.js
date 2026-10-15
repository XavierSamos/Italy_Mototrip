// Calculadora modular de presupuesto (Tab 4)

let currentBudgetMode = 'dual'; // 'dual' (Padre e Hijo, 2 Motos) | 'solo' (1 Moto, 1 Piloto)

const budgetDefaults = {
  routeKm: 2850,
  hotelNights: 8, // Días 2, 3, 4, 5, 6, 8, 9, 10 en tierra (Días 1, 7 y 11 ferrys)
  tripDays: 12,
  ferriesDual: 525.60, // BCN 170 + Mesina 32 + Palermo-Cagliari 196 + Porto Torres 127.60
  ferriesSolo: 415.81, // BCN 140 + Mesina 16 + Palermo-Cagliari 154.81 + Porto Torres 105
};

function setBudgetMode(mode) {
  currentBudgetMode = mode;
  const btnDual = document.getElementById('btn-mode-dual');
  const btnSolo = document.getElementById('btn-mode-solo');
  const moto2Container = document.getElementById('moto2-fuel-container');
  const badgeMode = document.getElementById('badge-budget-mode');
  const hotelRoomTypeLabel = document.getElementById('hotel-room-type-label');
  const foodPaxCount = document.getElementById('food-pax-count');

  if (mode === 'dual') {
    if (btnDual) {
      btnDual.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-amber-500 text-slate-950 shadow";
    }
    if (btnSolo) {
      btnSolo.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white";
    }
    if (moto2Container) moto2Container.classList.remove('hidden');
    if (badgeMode) badgeMode.innerText = "2 Motos · 2 Pax";
    if (hotelRoomTypeLabel) hotelRoomTypeLabel.innerText = "Precio Habitación Doble / Noche:";
    if (foodPaxCount) foodPaxCount.innerText = "2 pax";
  } else {
    if (btnSolo) {
      btnSolo.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-amber-500 text-slate-950 shadow";
    }
    if (btnDual) {
      btnDual.className = "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white";
    }
    if (moto2Container) moto2Container.classList.add('hidden');
    if (badgeMode) badgeMode.innerText = "1 Moto · 1 Pax";
    if (hotelRoomTypeLabel) hotelRoomTypeLabel.innerText = "Precio Habitación Individual / Noche:";
    if (foodPaxCount) foodPaxCount.innerText = "1 pax";
  }

  updateBudgetCalculator();
}

function formatEuro(value, decimals = 0) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value);
}

function updateBudgetCalculator() {
  const fuelPriceEl = document.getElementById('fuel-price-slider');
  const routeKmEl = document.getElementById('route-km-slider');
  const fuelAtEl = document.getElementById('fuel-at-slider');
  const fuelNcEl = document.getElementById('fuel-nc-slider');
  const hotelSlider = document.getElementById('hotel-night-slider');
  const breakfastEl = document.getElementById('food-breakfast-slider');
  const lunchEl = document.getElementById('food-lunch-slider');
  const dinnerEl = document.getElementById('food-dinner-slider');
  const tollsEl = document.getElementById('tolls-slider');
  const contingencyEl = document.getElementById('contingency-slider');

  if (!fuelPriceEl || !routeKmEl || !fuelAtEl || !hotelSlider) return;

  const fuelPrice = Number(fuelPriceEl.value);
  const routeKm = Number(routeKmEl.value);
  const fuelAt = Number(fuelAtEl.value);
  const fuelNc = fuelNcEl ? Number(fuelNcEl.value) : 5.5;
  const hotelPerNight = Number(hotelSlider.value);
  const breakfast = Number(breakfastEl.value);
  const lunch = Number(lunchEl.value);
  const dinner = Number(dinnerEl.value);
  const tollPerBike = Number(tollsEl.value);
  const contingencyPerPax = Number(contingencyEl.value);

  const isDual = currentBudgetMode === 'dual';
  const numPilots = isDual ? 2 : 1;
  const numBikes = isDual ? 2 : 1;

  // Fuel calculations
  const litersAt = (routeKm / 100) * fuelAt;
  const costAt = litersAt * fuelPrice;

  let litersNc = 0;
  let costNc = 0;
  if (isDual) {
    litersNc = (routeKm / 100) * fuelNc;
    costNc = litersNc * fuelPrice;
  }
  const totalFuel = costAt + costNc;

  // Ferries
  const totalFerries = isDual ? budgetDefaults.ferriesDual : budgetDefaults.ferriesSolo;

  // Hotels (8 nights in land)
  const totalHotels = budgetDefaults.hotelNights * hotelPerNight;

  // Meals (12 days)
  const dailyFoodPerPax = breakfast + lunch + dinner;
  const totalFood = dailyFoodPerPax * budgetDefaults.tripDays * numPilots;

  // Tolls & Contingency
  const totalTolls = tollPerBike * numBikes;
  const totalContingency = contingencyPerPax * numPilots;
  const totalTollsAndMisc = totalTolls + totalContingency;

  // Grand Totals
  const grandTotal = totalFuel + totalFerries + totalHotels + totalFood + totalTollsAndMisc;
  const perPerson = grandTotal / numPilots;

  // Update Labels & Inputs
  document.getElementById('fuel-price-label').innerText = fuelPrice.toFixed(2).replace('.', ',') + ' €/L';
  document.getElementById('route-km-label').innerText = routeKm.toLocaleString('es-ES') + ' km';
  document.getElementById('fuel-at-label').innerText = fuelAt.toFixed(1).replace('.', ',') + ' L/100 km';
  document.getElementById('fuel-at-subtotal').innerText = `${litersAt.toFixed(1).replace('.', ',')} L • ${formatEuro(costAt, 2)}`;
  
  if (fuelNcEl) {
    document.getElementById('fuel-nc-label').innerText = fuelNc.toFixed(1).replace('.', ',') + ' L/100 km';
    document.getElementById('fuel-nc-subtotal').innerText = `${litersNc.toFixed(1).replace('.', ',')} L • ${formatEuro(costNc, 2)}`;
  }

  document.getElementById('fuel-total-cost-badge').innerText = formatEuro(totalFuel, 0);

  document.getElementById('hotel-night-label').innerText = formatEuro(hotelPerNight) + '/noche';
  document.getElementById('hotel-cost-per-night-text').innerText = formatEuro(hotelPerNight);
  document.getElementById('hotel-total-cost-badge').innerText = formatEuro(totalHotels, 0);
  document.getElementById('hotel-calc-breakdown').innerText = `${formatEuro(totalHotels)} total (${formatEuro(totalHotels / numPilots)}/pers)`;

  document.getElementById('food-breakfast-label').innerText = formatEuro(breakfast) + '/pers/día';
  document.getElementById('food-lunch-label').innerText = formatEuro(lunch) + '/pers/día';
  document.getElementById('food-dinner-label').innerText = formatEuro(dinner) + '/pers/día';
  document.getElementById('food-daily-sum').innerText = formatEuro(dailyFoodPerPax);
  document.getElementById('food-grand-sum').innerText = formatEuro(totalFood);
  document.getElementById('food-total-cost-badge').innerText = formatEuro(totalFood, 0);

  document.getElementById('ferries-cost-display').innerText = formatEuro(totalFerries, 2);
  document.getElementById('ferry1-price-text').innerText = isDual ? '170,00 €' : '140,00 €';
  document.getElementById('ferry2-price-text').innerText = isDual ? '32,00 €' : '16,00 €';
  document.getElementById('ferry3-price-text').innerText = isDual ? '196,00 €' : '154,81 €';
  document.getElementById('ferry4-price-text').innerText = isDual ? '127,60 €' : '105,00 €';

  document.getElementById('tolls-label').innerText = formatEuro(tollPerBike) + ' / moto';
  document.getElementById('tolls-subtotal').innerText = `${formatEuro(totalTolls)} total (${numBikes} moto${numBikes > 1 ? 's' : ''})`;
  document.getElementById('contingency-label').innerText = formatEuro(contingencyPerPax) + ' / pers';
  document.getElementById('contingency-subtotal').innerText = `${formatEuro(totalContingency)} total (${numPilots} pax)`;
  document.getElementById('ferries-tolls-total-badge').innerText = formatEuro(totalFerries + totalTollsAndMisc, 0);

  // Grand Total Cards
  document.getElementById('budget-grand-total').innerText = formatEuro(grandTotal, 0);
  document.getElementById('budget-per-person').innerText = formatEuro(perPerson, 0);

  // Summary List
  document.getElementById('summary-ferries-badge').innerText = formatEuro(totalFerries, 0);
  document.getElementById('summary-hotels-badge').innerText = formatEuro(totalHotels, 0);
  document.getElementById('summary-fuel-badge').innerText = formatEuro(totalFuel, 0);
  document.getElementById('summary-food-badge').innerText = formatEuro(totalFood, 0);
  document.getElementById('summary-tolls-badge').innerText = formatEuro(totalTollsAndMisc, 0);

  // Percentage Distribution Bar
  if (grandTotal > 0) {
    const pctFerries = Math.round((totalFerries / grandTotal) * 100);
    const pctHotels = Math.round((totalHotels / grandTotal) * 100);
    const pctFuel = Math.round((totalFuel / grandTotal) * 100);
    const pctFood = Math.round((totalFood / grandTotal) * 100);
    const pctTolls = 100 - (pctFerries + pctHotels + pctFuel + pctFood);

    document.getElementById('bar-ferries').style.width = pctFerries + '%';
    document.getElementById('bar-hotels').style.width = pctHotels + '%';
    document.getElementById('bar-fuel').style.width = pctFuel + '%';
    document.getElementById('bar-food').style.width = pctFood + '%';
    document.getElementById('bar-tolls').style.width = Math.max(0, pctTolls) + '%';

    document.getElementById('pct-ferries').innerText = pctFerries + '%';
    document.getElementById('pct-hotels').innerText = pctHotels + '%';
    document.getElementById('pct-fuel').innerText = pctFuel + '%';
    document.getElementById('pct-food').innerText = pctFood + '%';
    document.getElementById('pct-tolls').innerText = Math.max(0, pctTolls) + '%';
  }
}
