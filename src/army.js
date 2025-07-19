import { UnitTypes } from "./config.js";
import { getUnitEffectiveHp, getUnitEffectiveDmg } from "./unitHelpers.js";

export const armyCounts = {};
for (const type in UnitTypes) {
  armyCounts[type] = 0;
}

export function addUnits(type, amount = 1) {
  armyCounts[type] += amount;
}

export function removeUnits(type, amount = 1) {
  armyCounts[type] = Math.max(0, armyCounts[type] - amount);
}

export function getUnitCount(type) {
  return armyCounts[type];
}

export function getCombinedHp() {
  let total = 0;
  for (const type in armyCounts) {
    const count = armyCounts[type];
    const perUnitHp = getUnitEffectiveHp(type);
    total += perUnitHp * count;
  }
  return total;
}

export function getCombinedDmg() {
  let total = 0;
  for (const type in armyCounts) {
    const count = armyCounts[type];
    const perUnitDmg = getUnitEffectiveDmg(type);
    total += perUnitDmg * count;
  }
  return total;
}

export function removeRandomUnit() {
  const weightedPool = [];
  for (const type in armyCounts) {
    const count = armyCounts[type];
    for (let i = 0; i < count; i++) {
      weightedPool.push(type);
    }
  }
  if (weightedPool.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  const chosenType = weightedPool[randomIndex];
  removeUnits(chosenType, 1);
  return chosenType;
}
