/** Pure validation independent from Google/Firebase and component state. */
const budgets = new Set(['Cheap', 'Moderate', 'Luxury']);
const travelers = new Set(['1', '2 People', '3 to 5 People', '5 to 10 People']);
const fence = String.fromCharCode(96).repeat(3);

export function validateTripPreferences(form) {
  if (!form || typeof form !== 'object') return 'Please complete the trip form.';
  if (typeof form.location?.label !== 'string' || !form.location.label.trim()) {
    return 'Select a destination from the location search.';
  }
  const days = Number(form.noOfDays);
  if (!Number.isInteger(days) || days < 1 || days > 5) {
    return 'Choose a trip length from 1 to 5 days.';
  }
  if (!budgets.has(form.budget)) return 'Choose a budget.';
  if (!travelers.has(form.traveler)) return 'Choose who is traveling.';
  return null;
}

export function parseItinerary(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('The provider returned an empty itinerary.');
  }
  const clean = text.trim()
    .replace(new RegExp('^' + fence + '(?:json)?\\s*', 'i'), '')
    .replace(new RegExp('\\s*' + fence + '$'), '');
  const result = JSON.parse(clean);
  if (!result || !Array.isArray(result.hotels) || !Array.isArray(result.itinerary) ||
      !result.itinerary.every(day => day && typeof day.day === 'string' && Array.isArray(day.plan))) {
    throw new Error('The provider response has an invalid itinerary schema.');
  }
  return result;
}
