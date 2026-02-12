import { MaterialUnit, StorageEntry } from './types';

/**
 * Standard conversion factors relative to base units:
 * Volume base: mL
 * Mass base: g
 * Discrete base: units
 */
const UNIT_FACTORS: Record<MaterialUnit, number> = {
  'mL': 1,
  'L': 1000,
  'µL': 0.001,
  'mg': 0.001,
  'g': 1,
  'kg': 1000,
  'units': 1,
  'vials': 1,
  'bottles': 1,
};

/**
 * Converts a value from one unit to another.
 * Assumes units are in the same category (e.g., volume to volume).
 */
export function convertToUnit(value: number, fromUnit: MaterialUnit, toUnit: MaterialUnit): number {
  if (fromUnit === toUnit) return value;
  
  const fromFactor = UNIT_FACTORS[fromUnit] || 1;
  const toFactor = UNIT_FACTORS[toUnit] || 1;
  
  return (value * fromFactor) / toFactor;
}

/**
 * Calculates the total volume/quantity for a set of storage entries, 
 * normalizing all aliquots to the specified target unit.
 */
export function calculateTotalFromEntries(entries: StorageEntry[], targetUnit: MaterialUnit): number {
  if (!entries || !Array.isArray(entries)) return 0;

  return entries.reduce((total, entry) => {
    const entrySum = entry.aliquots.reduce((aliquotTotal, a) => {
      const rawQuantity = Number(a.count) * Number(a.size);
      return aliquotTotal + convertToUnit(rawQuantity, a.unit as MaterialUnit, targetUnit);
    }, 0);
    return total + entrySum;
  }, 0);
}
