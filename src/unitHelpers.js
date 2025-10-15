import { UnitTypes } from "./config.js";
import { getArtifactEffectBonus, getAchievementBonus } from "./artifact.js";

export function getUnitEffectiveHp(type) {
  const baseHp = UnitTypes[type].baseHp;
  const hpBonus = getArtifactEffectBonus("unitHp%", type);
  const powerBonus = getArtifactEffectBonus("unitPower%", type);
  const achievementBonus = getAchievementBonus();
  return baseHp * (1 + hpBonus + powerBonus + achievementBonus);
}

export function getUnitEffectiveDmg(type) {
  const baseDmg = UnitTypes[type].baseDmg;
  const dmgBonus = getArtifactEffectBonus("allUnitDmg%", null);
  const powerBonus = getArtifactEffectBonus("unitPower%", type);
  const achievementBonus = getAchievementBonus();
  return baseDmg * (1 + dmgBonus + powerBonus + achievementBonus);
}
