import { convertHeroSoulsToTotal } from "./resources.js";
import { resetBattle, getKillCount } from "./battle.js";
import { resources } from "./resources.js";
import { armyCounts } from "./army.js";

export function canPrestige() {
  const requiredKills = 1;
  return getKillCount() >= requiredKills;
}

export function doPrestige() {
  resources.prestigeCount += 1;
  convertHeroSoulsToTotal();
  resetBattle();

  armyCounts["Goblin"] = 0;
  armyCounts["Orc"] = 0;
  armyCounts["Troll"] = 0;
  armyCounts["Ogre"] = 0;
  armyCounts["Dragon"] = 0;
}
