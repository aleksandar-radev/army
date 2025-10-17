import { UnitTypes } from "./config.js";
import { getArtifactEffectBonus } from "./artifact.js";

export function getUnitEffectiveHp(type) {
  const baseHp = UnitTypes[type].baseHp;
  const hpBonus = getArtifactEffectBonus("unitHp%", type);
  const powerBonus = getArtifactEffectBonus("unitPower%", type);
  return baseHp * (1 + hpBonus + powerBonus);
}

export function getUnitEffectiveDmg(type) {
  const baseDmg = UnitTypes[type].baseDmg;
  const dmgBonus = getArtifactEffectBonus("allUnitDmg%", null);
  const powerBonus = getArtifactEffectBonus("unitPower%", type);
  return baseDmg * (1 + dmgBonus + powerBonus);
}
