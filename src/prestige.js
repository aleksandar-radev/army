import { convertHeroSoulsToTotal } from "./resources.js";
import { resetBattle, getKillCount } from "./battle.js";
import { resources } from "./resources.js";
import { buildingStates } from "./town.js";
import { armyCounts } from "./army.js";
import { getArtifactEffectBonus } from "./artifact.js";

export function canPrestige() {
  const requiredKills = 1 * (resources.prestigeCount + 1);
  return getKillCount() >= requiredKills;
}

export function doPrestige() {
  resources.prestigeCount += 1;
  convertHeroSoulsToTotal();
  resetBattle();

  const goldBonus = getArtifactEffectBonus("startingGoldFlat");
  const goblinBonus = getArtifactEffectBonus("startingGoblinsFlat");
  const orcBonus = getArtifactEffectBonus("startingOrcsFlat");
  const trollBonus = getArtifactEffectBonus("startingTrollsFlat");
  const ogreBonus = getArtifactEffectBonus("startingOgresFlat");
  const dragonBonus = getArtifactEffectBonus("startingDragonsFlat");

  resources.gold = 100 + goldBonus;

  for (const type in armyCounts) {
    armyCounts[type] = 0;
  }
  armyCounts["Goblin"] = 10 + goblinBonus;
  armyCounts["Orc"] = 0 + orcBonus;
  armyCounts["Troll"] = 0 + trollBonus;
  armyCounts["Ogre"] = 0 + ogreBonus;
  armyCounts["Dragon"] = 0 + dragonBonus;

  for (const key in buildingStates) {
    buildingStates[key] = 0;
  }
  buildingStates["GoldMine"] = 1;
}
