// A short, plain-language note taxonomy for the scent-hint pickers on AI Analysis Results.
// Kept deliberately small for the prototype — a real build would source this from the
// fragrance consultant's working note library, not a hardcoded list.
export const NOTE_FAMILIES: { family: string; notes: string[] }[] = [
  { family: 'Fresh & green', notes: ['Leaf', 'Grapefruit', 'Lemon', 'Mint', 'Bergamot'] },
  { family: 'Floral & soft', notes: ['Jasmine', 'Rose', 'Lavender', 'Vanilla'] },
  { family: 'Warm & woody', notes: ['Sandalwood', 'Patchouli', 'Cardamom', 'Amber'] },
]

export const MAX_SCENT_HINTS = 5
