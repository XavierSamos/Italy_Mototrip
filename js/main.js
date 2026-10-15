// Cargar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFavorites();
  initMap();
  renderItineraryCards();
  renderCitiesTable();
  renderTransportGrid();
  renderActivitiesGrouped();
  updateBudgetCalculator();
  initPackingChecklist();
});
