export const resources = {
  gold: 0,
  heroSoulsStored: 0,
  heroSoulsTotal: 0,
  prestigeCount: 0,
};

export function addGold(amount) {
  resources.gold += amount;
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
