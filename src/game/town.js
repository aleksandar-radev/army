import { BuildingConfig } from "./config.js";
import { spendGold, addGold, resources } from "./resources.js";
import { addUnits } from "./army.js";
import {
  getArtifactEffectBonus,
  getAchievementGoldPerSecond,
} from "./artifact.js";
import { ACHIEVEMENTS } from "./achievements.js";

export const buildingStates = {};
for (const key in BuildingConfig) {
  buildingStates[key] = 0;
}

export const buildingSpawnProgress = {};

const BUILDING_SUFFIX_RE = /(Hut|Camp|Den|Tower|Roost)$/u;
const GOLD_MINE_KEY = "GoldMine";
const GOLD_ACHIEVEMENT_THRESHOLDS = ACHIEVEMENTS.filter(
  (achievement) => achievement.type === "gold"
)
  .map((achievement) => achievement.value)
  .sort((a, b) => a - b);

const spawnRemainders = {};
for (const key in BuildingConfig) {
  if (BuildingConfig[key].spawnPerMinute) {
    spawnRemainders[key] = 0;
    buildingSpawnProgress[key] = 0;
  }
}

const getUnitTypeFromBuilding = (buildingKey) =>
  buildingKey.replace(BUILDING_SUFFIX_RE, "");

const clampProgress = (value) => {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const getGoldMineGoldPerSecond = () => {
  const level = buildingStates[GOLD_MINE_KEY] || 0;
  if (level <= 0) {
    return 0;
  }

  const cfg = BuildingConfig[GOLD_MINE_KEY];
  if (!cfg?.goldPerSecond) {
    return 0;
  }

  const goldMineBonus = getArtifactEffectBonus("goldMine%");
  return cfg.goldPerSecond * level * (1 + goldMineBonus);
};

const countUnlockedGoldAchievements = (lifetimeGold) => {
  let count = 0;
  for (const threshold of GOLD_ACHIEVEMENT_THRESHOLDS) {
    if (lifetimeGold >= threshold) {
      count += 1;
      continue;
    }
    break;
  }
  return count;
};

export function getUpgradeCost(buildingKey) {
  const cfg = BuildingConfig[buildingKey];
  const currentLevel = buildingStates[buildingKey];
  return Math.floor(
    cfg.baseCost * Math.pow(cfg.costGrowth, currentLevel) +
      cfg.baseCost * currentLevel
  );
}

export function upgradeBuilding(buildingKey) {
  const cost = getUpgradeCost(buildingKey);
  if (!spendGold(cost)) return false;
  buildingStates[buildingKey] += 1;
  return true;
}

export function getBuildingLevel(buildingKey) {
  return buildingStates[buildingKey];
}

export function resetSpawnProgress() {
  for (const key in spawnRemainders) {
    spawnRemainders[key] = 0;
    buildingSpawnProgress[key] = 0;
  }
}

export function setSpawnProgress(progressMap = {}) {
  for (const key in spawnRemainders) {
    const value = clampProgress(Number(progressMap[key] ?? 0));
    spawnRemainders[key] = value;
    buildingSpawnProgress[key] = value;
  }
}

export function applyOfflineSummoning(secondsElapsed = 0) {
  if (!Number.isFinite(secondsElapsed) || secondsElapsed <= 0) {
    return {};
  }

  const summonedUnits = {};
  const summonBonus = getArtifactEffectBonus("buildingSummon%");

  for (const key in spawnRemainders) {
    const cfg = BuildingConfig[key];
    if (!cfg?.spawnPerMinute) continue;

    const level = buildingStates[key];
    if (level <= 0) {
      spawnRemainders[key] = 0;
      buildingSpawnProgress[key] = 0;
      continue;
    }

    const perSecondRate = (cfg.spawnPerMinute / 60) * level * (1 + summonBonus);
    if (perSecondRate <= 0) continue;

    let progress = (spawnRemainders[key] || 0) + perSecondRate * secondsElapsed;
    const toSpawn = Math.floor(progress);
    if (toSpawn > 0) {
      const unitType = getUnitTypeFromBuilding(key);
      addUnits(unitType, toSpawn);
      summonedUnits[unitType] = (summonedUnits[unitType] || 0) + toSpawn;
      progress -= toSpawn;
    }

    spawnRemainders[key] = progress;
    buildingSpawnProgress[key] = Math.min(1, progress);
  }

  return summonedUnits;
}

export function applyOfflineGold(secondsElapsed = 0) {
  if (!Number.isFinite(secondsElapsed) || secondsElapsed <= 0) {
    return 0;
  }

  const goldMinePerSecond = getGoldMineGoldPerSecond();
  const currentGoldAchievementCount = countUnlockedGoldAchievements(
    resources.lifetimeGold,
  );
  const achievementBase = Math.max(
    0,
    getAchievementGoldPerSecond() - currentGoldAchievementCount,
  );

  let remainingSeconds = secondsElapsed;
  let goldEarned = 0;
  let goldAchievements = currentGoldAchievementCount;
  let lifetimeGoldSim = resources.lifetimeGold;

  while (remainingSeconds > 0) {
    const rate = goldMinePerSecond + achievementBase + goldAchievements;
    if (rate <= 0) {
      break;
    }

    const nextThreshold = GOLD_ACHIEVEMENT_THRESHOLDS[goldAchievements];
    if (nextThreshold === undefined) {
      goldEarned += rate * remainingSeconds;
      lifetimeGoldSim += rate * remainingSeconds;
      remainingSeconds = 0;
      break;
    }

    const goldNeeded = nextThreshold - lifetimeGoldSim;
    if (goldNeeded <= 0) {
      goldAchievements += 1;
      continue;
    }

    const secondsToThreshold = goldNeeded / rate;
    if (!Number.isFinite(secondsToThreshold) || secondsToThreshold <= 0) {
      goldAchievements += 1;
      continue;
    }

    if (secondsToThreshold >= remainingSeconds) {
      goldEarned += rate * remainingSeconds;
      lifetimeGoldSim += rate * remainingSeconds;
      remainingSeconds = 0;
      break;
    }

    goldEarned += rate * secondsToThreshold;
    lifetimeGoldSim += rate * secondsToThreshold;
    remainingSeconds -= secondsToThreshold;
    goldAchievements += 1;
  }

  if (goldEarned > 0) {
    addGold(goldEarned);
  }

  return goldEarned;
}

export function tickTown() {
  const goldMinePerSecond = getGoldMineGoldPerSecond();
  if (goldMinePerSecond > 0) {
    addGold(goldMinePerSecond);
  }

  const achievementGold = getAchievementGoldPerSecond();
  if (achievementGold > 0) {
    addGold(achievementGold);
  }

  const summonBonus = getArtifactEffectBonus("buildingSummon%");

  for (const key in BuildingConfig) {
    const cfg = BuildingConfig[key];
    if (!cfg.spawnPerMinute) continue;

    const level = buildingStates[key];
    if (level <= 0) {
      spawnRemainders[key] = 0;
      buildingSpawnProgress[key] = 0;
      continue;
    }

    const perSecondRate = (cfg.spawnPerMinute / 60) * level * (1 + summonBonus);
    spawnRemainders[key] += perSecondRate;

    const toSpawn = Math.floor(spawnRemainders[key]);
    if (toSpawn >= 1) {
      const unitType = getUnitTypeFromBuilding(key);
      addUnits(unitType, toSpawn);
      spawnRemainders[key] -= toSpawn;
    }

    buildingSpawnProgress[key] = Math.min(1, spawnRemainders[key]);
  }
}
