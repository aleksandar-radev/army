import { getArtifactEffectBonus } from "./artifact.js";

export const resources = {
  gold: 0,
  heroSoulsStored: 0,
  heroSoulsTotal: 0,
  prestigeCount: 0,
  lifetimeGold: 0,
  lifetimeSouls: 0,
  lifetimeEnemiesSlain: 0,
  lifetimeSummoned: {
    Goblin: 0,
    Orc: 0,
    Troll: 0,
    Ogre: 0,
    Dragon: 0,
  },
  highestEnemyLevel: 1,
};

export function addGold(amount) {
  if (!Number.isFinite(amount) || amount === 0) {
    return 0;
  }

  const bonus = getArtifactEffectBonus("goldGain%");
  const multiplier = 1 + bonus;
  const finalAmount = amount * multiplier;

  resources.gold += finalAmount;
  resources.lifetimeGold += finalAmount;

  return finalAmount;
}

export function spendGold(amount) {
  if (resources.gold >= amount) {
    resources.gold -= amount;
    return true;
  }
  return false;
}

export function addHeroSoul(count = 1) {
  resources.heroSoulsStored += count;
  resources.lifetimeSouls += count;
}

export function convertHeroSoulsToTotal() {
  resources.heroSoulsTotal += resources.heroSoulsStored;
  resources.heroSoulsStored = 0;
}

export function addHeroSoulsToTotal(count = 1) {
  if (!Number.isFinite(count) || count === 0) {
    return;
  }

  resources.heroSoulsTotal += count;
  resources.lifetimeSouls += count;
}

export function spendHeroSouls(amount) {
  if (resources.heroSoulsTotal >= amount) {
    resources.heroSoulsTotal -= amount;
    return true;
  }
  return false;
}

export function getGold() {
  return resources.gold;
}

export function getHeroSoulsStored() {
  return resources.heroSoulsStored;
}

export function getHeroSoulsTotal() {
  return resources.heroSoulsTotal;
}
