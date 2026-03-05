/**
 * Dynamic water temperature recommendation engine.
 *
 * Recommends temperature based on roast level and grind size.
 * Internal calculations use Celsius. Display converts per user setting.
 *
 * General rules:
 *  - Lighter roasts benefit from hotter water to extract more
 *  - Darker roasts benefit from slightly cooler water to avoid bitterness
 *  - Finer grinds extract faster, so slightly cooler water helps
 *  - Coarser grinds extract slower, so slightly hotter water helps
 */

const ROAST_BASE_TEMP_C = {
  'light': 97,
  'medium-light': 95,
  'medium': 93,
  'medium-dark': 91,
  'dark': 88,
};

const GRIND_ADJUSTMENT_C = {
  'extra-fine': -3,
  'fine': -2,
  'medium-fine': -1,
  'medium': 0,
  'medium-coarse': 1,
  'coarse': 2,
};

export function recommendTemperatureCelsius(roastLevel, grindSize) {
  const base = ROAST_BASE_TEMP_C[roastLevel] ?? 93;
  const adjustment = GRIND_ADJUSTMENT_C[grindSize] ?? 0;
  const temp = base + adjustment;
  return Math.max(80, Math.min(100, temp));
}

export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f) {
  return Math.round(((f - 32) * 5) / 9);
}

export function formatTemperature(celsius, unitSystem) {
  if (unitSystem === 'imperial') {
    return `${celsiusToFahrenheit(celsius)}\u00B0F`;
  }
  return `${celsius}\u00B0C`;
}
