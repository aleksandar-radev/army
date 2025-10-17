import { computed } from 'vue';
import { defineStore } from 'pinia';
import { ACHIEVEMENTS } from '@/game/achievements.js';
import { artifactState, armyState, buildingState, resourceState, syncGameState } from '@/stores/gameState.js';
import { getArtifactUpgradeCost, getAllArtifactKeys, upgradeArtifact } from '@/game/artifact.js';
import { ArtifactConfig, BuildingConfig, UnitTypes } from '@/game/config.js';
import { getHeroSoulsTotal, getGold } from '@/game/resources.js';
import { getUpgradeCost, upgradeBuilding } from '@/game/town.js';
import { getUnitEffectiveDmg, getUnitEffectiveHp } from '@/game/unitHelpers.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';

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

const relicBuildingTargets = {
  hutBoost: 'GoblinHut',
  CampBoost: 'OrcCamp',
  DenBoost: 'TrollDen',
  TowerBoost: 'OgreTower',
  RoostBoost: 'DragonRoost',
  GoldMineBoost: 'GoldMine',
};

const humanizeKey = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\s+/, '')
    .trim();

const removeBuildingSuffix = (key) => key.replace(/(Hut|Camp|Den|Tower|Roost)$/u, '');

const formatRate = (value) =>
  Number.isInteger(value)
    ? formatNumber(value)
    : formatFloat(value, value < 1 ? 2 : 1);

export const useEconomyStore = defineStore('economy', () => {
  const resourcesView = resourceState;
  const armies = armyState;
  const buildings = buildingState;
  const relicState = artifactState;
  const i18n = useI18nStore();
  const t = i18n.t;

  const getUnitLabel = (unitKey, plural = false) => {
    const translationKey = `units.${unitKey}.${plural ? 'plural' : 'name'}`;
    const translated = t(translationKey);
    if (translated === translationKey) {
      const base = humanizeKey(unitKey);
      return plural ? `${base}s` : base;
    }
    return translated;
  };

  const getBuildingName = (key) => {
    const translationKey = `buildings.${key}.name`;
    const translated = t(translationKey);
    if (translated === translationKey) {
      return humanizeKey(key);
    }
    return translated;
  };

  const getArtifactName = (key) => {
    const translationKey = `artifacts.${key}.name`;
    const translated = t(translationKey);
    if (translated === translationKey) {
      return humanizeKey(key);
    }
    return translated;
  };

  const getEffectPrecision = (value) => {
    const absValue = Math.abs(value);
    if (absValue === 0) return 0;
    if (absValue >= 10) return 0;
    if (absValue >= 1) return 1;
    return 1;
  };

  const getArtifactDescription = (key, tier) => {
    const config = ArtifactConfig[key];
    if (!config) return { summary: '', detail: '' };

    const translationBase = `prestige.relicDescriptions.${key}`;
    const perTierBaseValue = config.effectValue;
    const isPercentEffect = typeof config.effect === 'string' && config.effect.endsWith('%');

    const perTierValue = isPercentEffect ? perTierBaseValue * 100 : perTierBaseValue;
    const currentValue = perTierValue * tier;

    const formatEffectValue = (value) =>
      Number.isInteger(value)
        ? formatNumber(value)
        : formatFloat(value, getEffectPrecision(value));

    const params = {
      summary: {
        value: formatEffectValue(perTierValue),
      },
      detail: {
        current: formatEffectValue(currentValue),
      },
    };

    if (config.appliesTo) {
      const unitName = getUnitLabel(config.appliesTo);
      params.summary.unitName = unitName;
      params.detail.unitName = unitName;
    }

    if (relicBuildingTargets[key]) {
      const buildingName = getBuildingName(relicBuildingTargets[key]);
      params.summary.buildingName = buildingName;
      params.detail.buildingName = buildingName;
    }

    const summaryTranslation = t(`${translationBase}.summary`, params.summary);
    const detailTranslation = t(`${translationBase}.detail`, params.detail);

    return {
      summary: summaryTranslation === `${translationBase}.summary` ? '' : summaryTranslation,
      detail: detailTranslation === `${translationBase}.detail` ? '' : detailTranslation,
    };
  };

  const buildDescription = (key, level) => {
    const config = BuildingConfig[key];
    if (!config) return { summary: '', detail: '' };

    if (config.goldPerSecond) {
      const perLevel = config.goldPerSecond;
      const current = perLevel * level;
      return {
        summary: t('town.descriptions.gold.summary', { rate: formatRate(perLevel) }),
        detail: level
          ? t('town.descriptions.gold.detailActive', { current: formatRate(current) })
          : t('town.descriptions.gold.detailInactive'),
      };
    }

    if (config.spawnPerMinute) {
      const perLevel = config.spawnPerMinute;
      const current = perLevel * level;
      const unitKey = removeBuildingSuffix(key);
      const unitPlural = getUnitLabel(unitKey, true);
      return {
        summary: t('town.descriptions.spawn.summary', {
          rate: formatRate(perLevel),
          unitPlural,
        }),
        detail: level
          ? t('town.descriptions.spawn.detailActive', {
              current: formatRate(current),
              unitPlural,
            })
          : t('town.descriptions.spawn.detailInactive', {
              unitPlural,
            }),
      };
    }

    return { summary: '', detail: '' };
  };

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
          name: getUnitLabel(type),
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
        name: getBuildingName(key),
        icon: buildingIcons[key] || '🏗️',
        level,
        cost,
        canAfford: getGold() >= cost,
        description: buildDescription(key, level),
      };
    }),
  );

  const relics = computed(() =>
    getAllArtifactKeys().map((key) => {
      const tier = relicState[key] || 0;
      const cost = getArtifactUpgradeCost(key);
      const description = getArtifactDescription(key, tier);
      return {
        key,
        name: getArtifactName(key),
        icon: relicIcons[key] || '🔮',
        tier,
        cost,
        maxed: !Number.isFinite(cost),
        affordable: Number.isFinite(cost) && getHeroSoulsTotal() >= cost,
        description,
      };
    }),
  );

  const prepareAchievementParams = (params = {}) => {
    const result = { ...params };
    if (result.rank !== undefined) {
      result.rank = formatNumber(result.rank);
    }
    if (result.amount !== undefined) {
      result.amount = formatNumber(result.amount);
    }
    if (result.unitKey) {
      result.unitName = getUnitLabel(result.unitKey, false);
      result.unitPlural = getUnitLabel(result.unitKey, true);
      delete result.unitKey;
    }
    return result;
  };

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

      const name = t(achievement.nameKey, prepareAchievementParams(achievement.nameParams));
      const description = t(
        achievement.descKey,
        prepareAchievementParams(achievement.descParams),
      );

      return {
        ...achievement,
        name,
        description,
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
