import { reactive } from 'vue';
import { setKillCount, startNewBattle } from '@/game/battle.js';
import { artifactStates } from '@/game/artifact.js';
import { armyCounts } from '@/game/army.js';
import { buildingStates, buildingSpawnProgress, resetSpawnProgress } from '@/game/town.js';
import { resources } from '@/game/resources.js';

const defaultSummoned = () => ({
  Goblin: 0,
  Orc: 0,
  Troll: 0,
  Ogre: 0,
  Dragon: 0,
});

const cloneResourceState = () => ({
  gold: resources.gold,
  heroSoulsStored: resources.heroSoulsStored,
  heroSoulsTotal: resources.heroSoulsTotal,
  prestigeCount: resources.prestigeCount || 0,
  lifetimeGold: resources.lifetimeGold || 0,
  lifetimeSouls: resources.lifetimeSouls || 0,
  lifetimeEnemiesSlain: resources.lifetimeEnemiesSlain || 0,
  lifetimeSummoned: { ...defaultSummoned(), ...(resources.lifetimeSummoned || {}) },
  highestEnemyLevel: resources.highestEnemyLevel || 1,
});

const cloneDictionary = (source) => ({ ...source });

export const resourceState = reactive(cloneResourceState());
export const armyState = reactive(cloneDictionary(armyCounts));
export const buildingState = reactive(cloneDictionary(buildingStates));
export const artifactState = reactive(cloneDictionary(artifactStates));
const cloneSpawnProgressState = () => ({ ...buildingSpawnProgress });
export const spawnProgressState = reactive(cloneSpawnProgressState());

export const syncGameState = () => {
  Object.assign(resourceState, cloneResourceState());
  Object.assign(armyState, cloneDictionary(armyCounts));
  Object.assign(buildingState, cloneDictionary(buildingStates));
  Object.assign(artifactState, cloneDictionary(artifactStates));
  Object.assign(spawnProgressState, cloneSpawnProgressState());
};

export const resetEngineState = () => {
  resources.gold = 1000;
  resources.heroSoulsStored = 0;
  resources.heroSoulsTotal = 0;
  resources.prestigeCount = 0;
  resources.lifetimeGold = 0;
  resources.lifetimeSouls = 0;
  resources.lifetimeEnemiesSlain = 0;
  resources.lifetimeSummoned = defaultSummoned();
  resources.highestEnemyLevel = 1;

  Object.keys(armyCounts).forEach((key) => {
    armyCounts[key] = 0;
  });

  Object.keys(buildingStates).forEach((key) => {
    buildingStates[key] = 0;
  });
  buildingStates.GoldMine = 1;

  Object.keys(artifactStates).forEach((key) => {
    artifactStates[key] = 0;
  });

  resetSpawnProgress();

  setKillCount(0);
  const enemy = startNewBattle();
  syncGameState();
  return enemy;
};
