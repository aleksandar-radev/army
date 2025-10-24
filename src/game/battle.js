import { getCombinedDmg, getUnitCount, removeUnits } from "./army.js";
import { getUnitEffectiveHp } from "./unitHelpers.js";
import { EnemyHero } from "./enemy.js";
import { addGold, addHeroSoul, resources } from "./resources.js";
import { EnemyRewards, UnitTypes } from "./config.js";
import { getHeroSoulMultiplier } from "./artifact.js";

let currentEnemy = null;
let killCount = 0;

function getGoldRewardForEnemy(level) {
  const baseGold = EnemyRewards.baseGold ?? 0;
  const growthRate = EnemyRewards.goldPerLevel ?? 0;
  const reward =
    baseGold * Math.pow(1 + growthRate, Math.max(0, level - 1));
  const roundedReward = Math.floor(reward);
  return Math.max(0, Number.isFinite(roundedReward) ? roundedReward : 0);
}

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

  const retaliation = _enemyRetaliate(enemy.getDmg());

  if (!enemy.isAlive()) {
    killCount += 1;
    resources.lifetimeEnemiesSlain += 1;
    const soulsGained = getHeroSoulMultiplier(enemy.getLevel());
    const goldGained = getGoldRewardForEnemy(enemy.getLevel());
    addHeroSoul(soulsGained);
    if (goldGained > 0) {
      addGold(goldGained);
    }

    currentEnemy = null;
    return {
      killed: true,
      newEnemyLevel: killCount + 1,
      storedSoulsGained: soulsGained,
      goldGained,
      enemyHpBeforeAttack,
      enemyHpAfterAttack: 0,
      heroDamage: heroDamageDealt,
      retaliation,
    };
  }

  return {
    killed: false,
    enemyHpBeforeAttack,
    enemyHpAfterAttack: enemy.getCurrentHp(),
    heroDamage: heroDamageDealt,
    retaliation,
  };
}

function _chooseRandomUnitType() {
  const availableTypes = Object.keys(UnitTypes).filter(
    (type) => getUnitCount(type) > 0,
  );

  if (availableTypes.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableTypes.length);
  return availableTypes[randomIndex] || null;
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
