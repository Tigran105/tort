export const seedCategories = [
  { name: 'Ծննդյան', sortOrder: 1 },
  { name: 'Հարսանեկան', sortOrder: 2 },
  { name: 'Մանկական', sortOrder: 3 },
  { name: 'Ամենօրյա / Թեյի սեղանի', sortOrder: 4 },
];

export const seedFruits = [
  { name: 'Ելակ', sortOrder: 1 },
  { name: 'Բանան', sortOrder: 2 },
  { name: 'Ազնվամորի (Մալինա)', sortOrder: 3 },
  { name: 'Հապալաս', sortOrder: 4 },
  { name: 'Բալ', sortOrder: 5 },
  { name: 'Առանց մրգի', sortOrder: 6 },
];

export const seedNuts = [
  { name: 'Ընկույզ', sortOrder: 1 },
  { name: 'Պիստակ', sortOrder: 2 },
  { name: 'Նուշ', sortOrder: 3 },
  { name: 'Առանց ընդեղենի', sortOrder: 4 },
];

export const seedFillings = [
  { name: 'Շոկոլադե', sortOrder: 1 },
  { name: 'Վանիլային', sortOrder: 2 },
  { name: 'Կարամելային', sortOrder: 3 },
  { name: 'Թթվասերային (Սմետաննի)', sortOrder: 4 },
  { name: 'Թավշյա (Red Velvet)', sortOrder: 5 },
];

export const seedSizes = [
  {
    code: 'S' as const,
    name: 'S',
    guestRange: '10-12 հոգանոց',
    sortOrder: 1,
  },
  {
    code: 'M' as const,
    name: 'M',
    guestRange: '15-20 հոգանոց',
    sortOrder: 2,
  },
  {
    code: 'L' as const,
    name: 'L',
    guestRange: '25+ հոգանոց',
    sortOrder: 3,
  },
];

export const seedTiers = [
  { level: 1 as const, name: '1 հարկանի', sortOrder: 1 },
  { level: 2 as const, name: '2 հարկանի', sortOrder: 2 },
  { level: 3 as const, name: '3 հարկանի', sortOrder: 3 },
];
