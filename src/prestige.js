import { convertHeroSoulsToTotal } from "./resources.js";
import { resetBattle, getKillCount } from "./battle.js";
import { resources } from "./resources.js";

export function canPrestige() {
  const requiredKills = 10 + resources.prestigeCount;
  return getKillCount() >= requiredKills;
}

export function doPrestige() {
  resources.prestigeCount += 1;
  convertHeroSoulsToTotal();
  resetBattle();
}
