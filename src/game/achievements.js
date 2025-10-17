const summonUnits = [
  {
    key: 'Goblin',
    values: [
      5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000,
    ],
  },
  {
    key: 'Orc',
    values: [
      2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000,
    ],
  },
  {
    key: 'Troll',
    values: [
      1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000,
    ],
  },
  {
    key: 'Ogre',
    values: [
      500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000,
    ],
  },
  {
    key: 'Dragon',
    values: [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
  },
];

export const ACHIEVEMENTS = [
  ...[
    10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000,
    10000000, 25000000, 50000000, 100000000, 250000000, 500000000, 750000000,
    1000000000, 2500000000, 5000000000, 10000000000,
  ].map((value, index) => ({
    id: `gold_${index + 1}`,
    type: 'gold',
    value,
    nameKey: 'achievements.goldCollector.name',
    nameParams: { rank: index + 1 },
    descKey: 'achievements.goldCollector.desc',
    descParams: { amount: value },
  })),

  ...summonUnits.flatMap((unit) =>
    unit.values.map((value, index) => ({
      id: `${unit.key.toLowerCase()}_${index + 1}`,
      type: `summon_${unit.key}`,
      value,
      nameKey: 'achievements.summoner.name',
      nameParams: { rank: index + 1, unitKey: unit.key },
      descKey: 'achievements.summoner.desc',
      descParams: { amount: value, unitKey: unit.key },
    })),
  ),

  ...[
    10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000,
    250000, 500000, 750000, 1000000, 2500000, 5000000, 10000000,
  ].map((value, index) => ({
    id: `soul_${index + 1}`,
    type: 'soul',
    value,
    nameKey: 'achievements.soulGatherer.name',
    nameParams: { rank: index + 1 },
    descKey: 'achievements.soulGatherer.desc',
    descParams: { amount: value },
  })),

  ...[
    10, 25, 50, 100, 250, 500, 750, 1000, 1500, 3000, 5000, 7500, 10000, 25000,
    50000, 100000, 250000, 500000, 750000, 1000000,
  ].map((value, index) => ({
    id: `slain_${index + 1}`,
    type: 'slain',
    value,
    nameKey: 'achievements.enemySlayer.name',
    nameParams: { rank: index + 1 },
    descKey: 'achievements.enemySlayer.desc',
    descParams: { amount: value },
  })),

  ...[5, 10, 25, 50, 75, 100, 250, 500, 750, 1000].map((value, index) => ({
    id: `herolevel_${index + 1}`,
    type: 'herolevel',
    value,
    nameKey: 'achievements.heroLevel.name',
    nameParams: { rank: index + 1 },
    descKey: 'achievements.heroLevel.desc',
    descParams: { amount: value },
  })),

  ...[10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000].map((value, index) => ({
    id: `prestige_${index + 1}`,
    type: 'prestige',
    value,
    nameKey: 'achievements.prestigeMaster.name',
    nameParams: { rank: index + 1 },
    descKey: 'achievements.prestigeMaster.desc',
    descParams: { amount: value },
  })),
];
