/**
 * Unit conversion and formatting utilities.
 *
 * Coffee and water amounts are stored in grams internally.
 * Imperial display uses ounces for water volume.
 */

const GRAMS_PER_OZ = 28.3495;

export function gramsToOz(grams) {
  return Math.round((grams / GRAMS_PER_OZ) * 10) / 10;
}

export function ozToGrams(oz) {
  return Math.round(oz * GRAMS_PER_OZ);
}

export function formatWaterAmount(grams, unitSystem) {
  if (unitSystem === 'imperial') {
    return `${gramsToOz(grams)} oz`;
  }
  return `${Math.round(grams)} g`;
}

export function formatCoffeeAmount(grams, unitSystem) {
  // Coffee is typically measured in grams even in imperial,
  // but we provide both options
  if (unitSystem === 'imperial') {
    return `${gramsToOz(grams)} oz`;
  }
  return `${Math.round(grams)} g`;
}

export function formatRatio(ratio) {
  return `1:${ratio}`;
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
