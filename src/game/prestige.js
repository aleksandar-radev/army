import { convertHeroSoulsToTotal } from "./resources.js";
import { getKillCount, resetBattle } from "./battle.js";
import { resources } from "./resources.js";
import { armyCounts } from "./army.js";

export const PRESTIGE_REQUIRED_LEVEL = 20;

export function canPrestige() {
  const defeatedEnemies = getKillCount();
  const currentLevel = defeatedEnemies + 1;
  return currentLevel >= PRESTIGE_REQUIRED_LEVEL;
}

export function doPrestige() {
  if (!canPrestige()) {
    return false;
  }

  resources.prestigeCount += 1;
  convertHeroSoulsToTotal();
  resetBattle();

  armyCounts["Goblin"] = 0;
  armyCounts["Orc"] = 0;
  armyCounts["Troll"] = 0;
  armyCounts["Ogre"] = 0;
  armyCounts["Dragon"] = 0;

  return true;
}
