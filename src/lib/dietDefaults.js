// ===========================================================================
// dietDefaults.js — the starting meal checklist. You can fully edit these in
// the app (add/remove items, change protein & calories). This is just the
// pre-filled starting point based on your typical day.
// ===========================================================================

// Each item: id, name, protein (grams), calories (kcal).
// Numbers are sensible estimates — tweak them to match your portions.
export const DEFAULT_DIET_ITEMS = [
  { id: 'shake', name: 'Morning protein shake', protein: 30, calories: 160 },
  { id: 'eggs', name: 'Boiled eggs (x4)', protein: 24, calories: 300 },
  { id: 'chicken', name: 'Chicken 150–200g', protein: 52, calories: 300 },
  { id: 'dal', name: 'Dal bowl', protein: 12, calories: 180 },
  { id: 'rice', name: 'Rice portion', protein: 4, calories: 250 },
  { id: 'fruits', name: 'Fruits', protein: 2, calories: 120 },
]

// Your daily protein goal range (grams).
export const PROTEIN_TARGET = { min: 160, max: 175 }
