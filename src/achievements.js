export const ACHIEVEMENTS = [
  ...[
    10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000,
    10000000, 25000000, 50000000, 100000000, 250000000, 500000000, 750000000,
    1000000000, 2500000000, 5000000000, 10000000000,
  ].map((value, i) => ({
    id: `gold_${i + 1}`,
    name: `Gold Collector ${i + 1}`,
    desc: `Gather ${value.toLocaleString()} gold.`,
    type: "gold",
    value,
  })),

  ...[
    {
      name: "Goblin",
      values: [
        5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000,
        5000000,
      ],
    },
    {
      name: "Orc",
      values: [
        2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000,
        2500000,
      ],
    },
    {
      name: "Troll",
      values: [
        1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000,
      ],
    },
    {
      name: "Ogre",
      values: [
        500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000,
      ],
    },
    {
      name: "Dragon",
      values: [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
    },
  ].flatMap((unit) =>
    unit.values.map((value, i) => ({
      id: `${unit.name.toLowerCase()}_${i + 1}`,
      name: `${unit.name} Summoner ${i + 1}`,
      desc: `Summon ${value.toLocaleString()} ${unit.name}s.`,
      type: `summon_${unit.name}`,
      value,
    }))
  ),

  ...[
    10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000,
    250000, 500000, 750000, 1000000, 2500000, 5000000, 10000000,
  ].map((value, i) => ({
    id: `soul_${i + 1}`,
    name: `Soul Gatherer ${i + 1}`,
    desc: `Collect ${value.toLocaleString()} hero souls.`,
    type: "soul",
    value,
  })),

  ...[
    1, 5, 10, 25, 50, 100, 250, 500, 750, 1000, 2500, 5000, 10000, 25000, 50000,
    100000, 250000, 500000, 750000, 1000000,
  ].map((value, i) => ({
    id: `slain_${i + 1}`,
    name: `Slayer ${i + 1}`,
    desc: `Slay ${value.toLocaleString()} enemies.`,
    type: "slain",
    value,
  })),

  ...[5, 10, 25, 50, 75, 100, 250, 500, 750, 1000].map((value, i) => ({
    id: `herolevel_${i + 1}`,
    name: `Heroic Challenger ${i + 1}`,
    desc: `Reach enemy level ${value.toLocaleString()}.`,
    type: "herolevel",
    value,
  })),

  ...[10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000].map((value, i) => ({
    id: `prestige_${i + 1}`,
    name: `Prestige Master ${i + 1}`,
    desc: `Prestige ${value.toLocaleString()} times.`,
    type: "prestige",
    value,
  })),
];
