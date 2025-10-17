import { getCombinedDmg, getUnitCount, removeUnits } from "./army.js";
import { getUnitEffectiveHp } from "./unitHelpers.js";
import { EnemyHero } from "./enemy.js";
import { addHeroSoul, resources } from "./resources.js";
import { UnitTypes } from "./config.js";
import { getHeroSoulMultiplier } from "./artifact.js";

let currentEnemy = null;
let killCount = 0;

export function startNewBattle() {
  const nextLevel = killCount + 1;
  currentEnemy = new EnemyHero(nextLevel);
  if (!resources.highestEnemyLevel || nextLevel > resources.highestEnemyLevel) {
    resources.highestEnemyLevel = nextLevel;
  }
  return currentEnemy;
}

export function getCurrentEnemy() {
  return currentEnemy;
}

export function getKillCount() {
  return killCount;
}

export function setKillCount(count) {
  killCount = count;
}

export function attack() {
  if (!currentEnemy) {
    startNewBattle();
  }

  const enemy = currentEnemy;
  const combinedDmg = getCombinedDmg();
  const enemyHpBeforeAttack = enemy.getCurrentHp();
  const heroDamageDealt = Math.min(combinedDmg, enemyHpBeforeAttack);

  enemy.takeDamage(combinedDmg);

  if (!enemy.isAlive()) {
    killCount += 1;
    resources.lifetimeEnemiesSlain += 1;
    const soulsGained = getHeroSoulMultiplier(enemy.getLevel());
    addHeroSoul(soulsGained);

    currentEnemy = null;
    return {
      killed: true,
      newEnemyLevel: killCount + 1,
      storedSoulsGained: soulsGained,
      enemyHpBeforeAttack,
      enemyHpAfterAttack: 0,
      heroDamage: heroDamageDealt,
      retaliation: { type: null, unitsLost: 0, damageDealt: 0 },
    };
  }

  const retaliation = _enemyRetaliate(enemy.getDmg());

  return {
    killed: false,
    enemyHpBeforeAttack,
    enemyHpAfterAttack: enemy.getCurrentHp(),
    heroDamage: heroDamageDealt,
    retaliation,
  };
}

function _chooseRandomUnitType() {
  const types = Object.keys(UnitTypes);
  let totalUnits = 0;
  for (const type of types) {
    totalUnits += getUnitCount(type);
  }
  if (totalUnits === 0) return null;

  const rand = Math.floor(Math.random() * totalUnits);
  let cumulative = 0;
  for (const type of types) {
    cumulative += getUnitCount(type);
    if (rand < cumulative) return type;
  }
  return null;
}

function _enemyRetaliate(enemyDmg) {
  const type = _chooseRandomUnitType();
  if (!type) return { type: null, unitsLost: 0, damageDealt: 0 };

  const count = getUnitCount(type);
  const perUnitHp = getUnitEffectiveHp(type);
  let unitsToKill = Math.floor(enemyDmg / perUnitHp);
  if (unitsToKill <= 0) return { type, unitsLost: 0, damageDealt: 0 };
  if (unitsToKill > count) unitsToKill = count;

  const damageDealt = unitsToKill * perUnitHp;

  removeUnits(type, unitsToKill);
  return { type, unitsLost: unitsToKill, damageDealt };
}

export function resetBattle() {
  currentEnemy = null;
  killCount = 0;
}
