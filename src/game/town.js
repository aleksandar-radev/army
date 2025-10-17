import { BuildingConfig } from "./config.js";
import { spendGold, addGold } from "./resources.js";
import { addUnits } from "./army.js";
import {
  getArtifactEffectBonus,
  getAchievementGoldPerSecond,
} from "./artifact.js";

export const buildingStates = {};
for (const key in BuildingConfig) {
  buildingStates[key] = 0;
}

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

const spawnRemainders = {};
for (const key in BuildingConfig) {
  if (BuildingConfig[key].spawnPerMinute) {
    spawnRemainders[key] = 0;
  }
}

export function tickTown() {
  const goldMineLevel = buildingStates["GoldMine"] || 0;
  if (goldMineLevel > 0) {
    const baseGoldPerSec =
      BuildingConfig["GoldMine"].goldPerSecond * goldMineLevel;
    const goldMineBonus = getArtifactEffectBonus("goldMine%");
    const totalGoldPerSec = baseGoldPerSec * (1 + goldMineBonus);
    addGold(totalGoldPerSec);
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
    if (level <= 0) continue;

    const perSecondRate = (cfg.spawnPerMinute / 60) * level * (1 + summonBonus);
    spawnRemainders[key] += perSecondRate;

    const toSpawn = Math.floor(spawnRemainders[key]);
    if (toSpawn >= 1) {
      const unitType = key
        .replace("Hut", "")
        .replace("Camp", "")
        .replace("Den", "")
        .replace("Tower", "")
        .replace("Roost", "");
      addUnits(unitType, toSpawn);
      spawnRemainders[key] -= toSpawn;
    }
  }
}
