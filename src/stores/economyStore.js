import { computed } from 'vue';
import { defineStore } from 'pinia';
import { ACHIEVEMENTS } from '@/game/achievements.js';
import { artifactState, armyState, buildingState, resourceState, syncGameState } from '@/stores/gameState.js';
import { getArtifactUpgradeCost, getAllArtifactKeys, upgradeArtifact } from '@/game/artifact.js';
import { UnitTypes } from '@/game/config.js';
import { getHeroSoulsTotal, getGold } from '@/game/resources.js';
import { getUpgradeCost, upgradeBuilding } from '@/game/town.js';
import { getUnitEffectiveDmg, getUnitEffectiveHp } from '@/game/unitHelpers.js';

const unitIcons = {
  Goblin: '👺',
  Orc: '🪓',
  Troll: '🧌',
  Ogre: '🏯',
  Dragon: '🐉',
};

const buildingIcons = {
  GoldMine: '⛏️',
  GoblinHut: '👺',
  OrcCamp: '🪓',
  TrollDen: '🧌',
  OgreTower: '🏯',
  DragonRoost: '🐉',
};

const relicIcons = {
  GoldMineBoost: '⛏️',
  HeroSoulBooster: '🔥',
  GoblinPower: '👺',
  OrcPower: '🪓',
  TrollPower: '🧌',
  OgrePower: '🏯',
  DragonPower: '🐉',
  hutBoost: '🏚️',
  CampBoost: '⛺',
  DenBoost: '🏠',
  TowerBoost: '🗼',
  RoostBoost: '🦅',
};

export const useEconomyStore = defineStore('economy', () => {
  const resourcesView = resourceState;
  const armies = armyState;
  const buildings = buildingState;
  const relicState = artifactState;

  const resourceSummary = computed(() => ({
    gold: Math.floor(resourcesView.gold || 0),
    heroSoulsStored: resourcesView.heroSoulsStored || 0,
    heroSoulsTotal: resourcesView.heroSoulsTotal || 0,
    prestigeCount: resourcesView.prestigeCount || 0,
  }));

  const armyCards = computed(() =>
    Object.keys(UnitTypes)
      .map((type) => {
        const count = armies[type] || 0;
        if (count <= 0) return null;
        const perHp = getUnitEffectiveHp(type);
        const perDmg = getUnitEffectiveDmg(type);
        return {
          type,
          icon: unitIcons[type] || '🛡️',
          count,
          perHp,
          perDmg,
          totalHp: perHp * count,
          totalDmg: perDmg * count,
        };
      })
      .filter(Boolean),
  );

  const townBuildings = computed(() =>
    Object.keys(buildings).map((key) => {
      const level = buildings[key] || 0;
      const cost = getUpgradeCost(key);
      return {
        key,
        icon: buildingIcons[key] || '🏗️',
        level,
        cost,
        canAfford: getGold() >= cost,
      };
    }),
  );

  const relics = computed(() =>
    getAllArtifactKeys().map((key) => {
      const tier = relicState[key] || 0;
      const cost = getArtifactUpgradeCost(key);
      return {
        key,
        icon: relicIcons[key] || '🔮',
        tier,
        cost,
        maxed: !Number.isFinite(cost),
        affordable: Number.isFinite(cost) && getHeroSoulsTotal() >= cost,
      };
    }),
  );

  const achievements = computed(() => {
    let unlockedCount = 0;
    const list = ACHIEVEMENTS.map((achievement) => {
      let progress = 0;
      if (achievement.type === 'gold') progress = Math.floor(resourcesView.lifetimeGold || 0);
      else if (achievement.type === 'soul') progress = resourcesView.lifetimeSouls || 0;
      else if (achievement.type === 'slain') progress = resourcesView.lifetimeEnemiesSlain || 0;
      else if (achievement.type === 'herolevel') progress = resourcesView.highestEnemyLevel || 0;
      else if (achievement.type === 'prestige') progress = resourcesView.prestigeCount || 0;
      else if (achievement.type.startsWith('summon_')) {
        const unitKey = achievement.type.split('_')[1];
        progress = resourcesView.lifetimeSummoned?.[unitKey] || 0;
      }

      const unlocked = progress >= achievement.value;
      if (unlocked) unlockedCount += 1;
      const percent = Math.min(100, (progress / achievement.value) * 100);

      return {
        ...achievement,
        progress: Math.floor(Math.min(progress, achievement.value)),
        percent,
        unlocked,
      };
    });

    return {
      unlockedCount,
      total: ACHIEVEMENTS.length,
      list,
    };
  });

  const sync = () => {
    syncGameState();
  };

  const upgradeTownBuilding = (key) => {
    const updated = upgradeBuilding(key);
    if (updated) {
      syncGameState();
    }
    return updated;
  };

  const upgradeRelic = (key) => {
    const updated = upgradeArtifact(key);
    if (updated) {
      syncGameState();
    }
    return updated;
  };

  return {
    resourcesView,
    resourceSummary,
    armyCards,
    townBuildings,
    relics,
    achievements,
    sync,
    upgradeTownBuilding,
    upgradeRelic,
  };
});
