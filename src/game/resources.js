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
};

export function addGold(amount) {
  resources.gold += amount;
  resources.lifetimeGold += amount;
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
