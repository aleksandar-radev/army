export const UnitTypes = {
  Goblin: { baseHp: 3, baseDmg: 1, spawnBuildingKey: "goblinHut" },
  Orc: { baseHp: 10, baseDmg: 3, spawnBuildingKey: "orcCamp" },
  Troll: { baseHp: 25, baseDmg: 10, spawnBuildingKey: "trollDen" },
  Ogre: { baseHp: 65, baseDmg: 25, spawnBuildingKey: "ogreTower" },
  Dragon: { baseHp: 500, baseDmg: 150, spawnBuildingKey: "dragonRoost" },
};

export const BuildingConfig = {
  GoldMine: {
    baseCost: 87,
    costGrowth: 1.15,
    goldPerSecond: 1,
  },
  GoblinHut: {
    baseCost: 50,
    costGrowth: 1.15,
    spawnPerMinute: 2,
  },
  OrcCamp: {
    baseCost: 200,
    costGrowth: 1.15,
    spawnPerMinute: 1,
  },
  TrollDen: {
    baseCost: 500,
    costGrowth: 1.15,
    spawnPerMinute: 0.5,
  },
  OgreTower: {
    baseCost: 2000,
    costGrowth: 1.15,
    spawnPerMinute: 0.2,
  },
  DragonRoost: {
    baseCost: 10000,
    costGrowth: 1.15,
    spawnPerMinute: 0.1,
  },
};

export const EnemyConfig = {
  baseHp: 10,
  hpGrowth: 1.15,
  baseDmg: 2,
  dmgGrowth: 1.15,
};

export const ArtifactConfig = {
  GoldenTouch: {
    baseCost: 10,
    costGrowth: 1.5,
    effect: "goldPerSecFlat",
    effectValue: 1,
    maxTier: 1000,
  },
  StartingGoldBoost: {
    baseCost: 10,
    costGrowth: 1.5,
    effect: "startingGoldFlat",
    effectValue: 1000,
    maxTier: 1000,
  },
  HeroSoulBooster: {
    baseCost: 10,
    costGrowth: 1.5,
    effect: "heroSoulMultiplier",
    effectValue: 0.1,
    maxTier: 1000,
  },
  GoblinPower: {
    baseCost: 5,
    costGrowth: 1.3,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Goblin",
    maxTier: 1000,
  },
  OrcPower: {
    baseCost: 10,
    costGrowth: 1.3,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Orc",
    maxTier: 1000,
  },
  TrollPower: {
    baseCost: 20,
    costGrowth: 1.3,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Troll",
    maxTier: 1000,
  },
  OgrePower: {
    baseCost: 50,
    costGrowth: 1.3,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Ogre",
    maxTier: 1000,
  },
  DragonPower: {
    baseCost: 100,
    costGrowth: 1.3,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Dragon",
    maxTier: 1000,
  },
  GoblinSummon: {
    baseCost: 20,
    costGrowth: 1.5,
    effect: "startingGoblinsFlat",
    effectValue: 1,
    maxTier: 1000,
  },
  OrcSummon: {
    baseCost: 50,
    costGrowth: 1.5,
    effect: "startingOrcsFlat",
    effectValue: 1,
    maxTier: 1000,
  },
  TrollSummon: {
    baseCost: 200,
    costGrowth: 1.5,
    effect: "startingTrollsFlat",
    effectValue: 1,
    maxTier: 1000,
  },
  OgreSummon: {
    baseCost: 500,
    costGrowth: 1.5,
    effect: "startingOgresFlat",
    effectValue: 1,
    maxTier: 1000,
  },
  DragonSummon: {
    baseCost: 5000,
    costGrowth: 1.5,
    effect: "startingDragonsFlat",
    effectValue: 1,
    maxTier: 1000,
  },
};

export const PrestigeConfig = {};

export const TickConfig = {
  intervalMs: 1000,
};

export const GameMeta = {
  version: "1.0.0",
  name: "Army Builder",
};
