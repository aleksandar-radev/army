export const UnitTypes = {
  Goblin: { baseHp: 3.0, baseDmg: 1.0, spawnBuildingKey: "goblinHut" },
  Orc: { baseHp: 10.0, baseDmg: 3.0, spawnBuildingKey: "orcCamp" },
  Troll: { baseHp: 25.0, baseDmg: 10.0, spawnBuildingKey: "trollDen" },
  Ogre: { baseHp: 65.0, baseDmg: 25.0, spawnBuildingKey: "ogreTower" },
  Dragon: { baseHp: 500.0, baseDmg: 150.0, spawnBuildingKey: "dragonRoost" },
};

export const BuildingConfig = {
  GoldMine: {
    baseCost: 49,
    costGrowth: 1.015,
    goldPerSecond: 1,
  },
  GoblinHut: {
    baseCost: 50,
    costGrowth: 1.015,
    spawnPerMinute: 2,
  },
  OrcCamp: {
    baseCost: 200,
    costGrowth: 1.015,
    spawnPerMinute: 1,
  },
  TrollDen: {
    baseCost: 500,
    costGrowth: 1.015,
    spawnPerMinute: 0.5,
  },
  OgreTower: {
    baseCost: 2000,
    costGrowth: 1.015,
    spawnPerMinute: 0.2,
  },
  DragonRoost: {
    baseCost: 10000,
    costGrowth: 1.015,
    spawnPerMinute: 0.1,
  },
};

export const EnemyConfig = {
  baseHp: 5,
  hpGrowth: 1.05,
  baseDmg: 0.5,
  dmgGrowth: 1.04,
};

export const ArtifactConfig = {
  GoldMineBoost: {
    baseCost: 10,
    costGrowth: 1.1,
    effect: "goldMine%",
    effectValue: 0.1,
    maxTier: 1000,
  },
  HeroSoulBooster: {
    baseCost: 20,
    costGrowth: 1.4,
    effect: "heroSoulMultiplier",
    effectValue: 0.1,
    maxTier: 1000,
  },
  GoblinPower: {
    baseCost: 20,
    costGrowth: 1.2,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Goblin",
    maxTier: 1000,
  },
  OrcPower: {
    baseCost: 50,
    costGrowth: 1.2,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Orc",
    maxTier: 1000,
  },
  TrollPower: {
    baseCost: 200,
    costGrowth: 1.2,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Troll",
    maxTier: 1000,
  },
  OgrePower: {
    baseCost: 400,
    costGrowth: 1.2,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Ogre",
    maxTier: 1000,
  },
  DragonPower: {
    baseCost: 2000,
    costGrowth: 1.2,
    effect: "unitPower%",
    effectValue: 0.1,
    appliesTo: "Dragon",
    maxTier: 1000,
  },
  hutBoost: {
    baseCost: 40,
    costGrowth: 1.2,
    effect: "buildingSummon%",
    effectValue: 0.1,
    maxTier: 1000,
  },
  CampBoost: {
    baseCost: 100,
    costGrowth: 1.2,
    effect: "buildingSummon%",
    effectValue: 0.1,
    maxTier: 1000,
  },
  DenBoost: {
    baseCost: 400,
    costGrowth: 1.2,
    effect: "buildingSummon%",
    effectValue: 0.1,
    maxTier: 1000,
  },
  TowerBoost: {
    baseCost: 800,
    costGrowth: 1.2,
    effect: "buildingSummon%",
    effectValue: 0.1,
    maxTier: 1000,
  },
  RoostBoost: {
    baseCost: 4000,
    costGrowth: 1.2,
    effect: "buildingSummon%",
    effectValue: 0.1,
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
