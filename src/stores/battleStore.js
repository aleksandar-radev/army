import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { attack, getCurrentEnemy, getKillCount, startNewBattle } from '@/game/battle.js';
import { useEconomyStore } from '@/stores/economyStore.js';
import { useI18nStore } from '@/stores/i18nStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';

const formatEnemy = (enemy) => {
  if (!enemy) return null;
  return {
    level: enemy.getLevel(),
    currentHp: enemy.getCurrentHp(),
    maxHp: enemy.getMaxHp(),
    dmg: enemy.getDmg(),
  };
};

const createRetaliationState = (retaliation) => {
  if (!retaliation.type) {
    return { kind: 'none' };
  }

  if (retaliation.unitsLost > 0) {
    return {
      kind: 'killed',
      unit: retaliation.type,
      count: retaliation.unitsLost,
    };
  }

  return {
    kind: 'noLoss',
    unit: retaliation.type,
  };
};

export const useBattleStore = defineStore('battle', () => {
  const enemy = ref(formatEnemy(getCurrentEnemy()));
  const killCount = ref(getKillCount());
  const logEntry = ref({ type: 'instructions' });

  const i18n = useI18nStore();
  const t = i18n.t;

  const currentEnemy = computed(() => enemy.value);

  const battleLog = computed(() => {
    const entry = logEntry.value;
    if (!entry) return '';

    if (entry.type === 'instructions') {
      return t('battle.log.holdToAttack');
    }

    if (entry.type === 'defeat') {
      return t('battle.log.enemyDefeated', { souls: formatFloat(entry.souls, 1) });
    }

    if (entry.type === 'damage') {
      const lines = [t('battle.log.damageReport', { hp: formatFloat(entry.hp, 1) })];
      const retaliation = entry.retaliation || { kind: 'none' };
      if (retaliation.kind === 'killed') {
        const unitLabel = retaliation.count === 1
          ? t(`units.${retaliation.unit}.name`)
          : t(`units.${retaliation.unit}.plural`);
        lines.push(
          t('battle.log.retaliationKilled', {
            count: formatNumber(retaliation.count),
            unit: unitLabel,
          }),
        );
      } else if (retaliation.kind === 'noLoss') {
        const unitLabel = t(`units.${retaliation.unit}.plural`);
        lines.push(t('battle.log.retaliationNone', { unit: unitLabel }));
      } else {
        lines.push(t('battle.log.noRetaliation'));
      }
      return lines.join('\n');
    }

    if (entry.type === 'status') {
      return t(entry.key, entry.params || {});
    }

    return '';
  });

  const setLogEntry = (entry) => {
    logEntry.value = entry;
  };

  const setEnemy = (value) => {
    enemy.value = formatEnemy(value);
  };

  const refreshEnemy = () => {
    setEnemy(getCurrentEnemy());
  };

  const refreshKillCount = () => {
    killCount.value = getKillCount();
  };

  const attackEnemy = () => {
    const economy = useEconomyStore();
    const result = attack();

    if (result.killed) {
      setLogEntry({ type: 'defeat', souls: result.storedSoulsGained });
      const nextEnemy = startNewBattle();
      setEnemy(nextEnemy);
    } else {
      const retaliationState = createRetaliationState(result.retaliation);
      setLogEntry({
        type: 'damage',
        hp: result.enemyHpAfterAttack,
        retaliation: retaliationState,
      });
    }

    refreshKillCount();
    economy.sync();
    return result;
  };

  return {
    currentEnemy,
    killCount,
    battleLog,
    attackEnemy,
    setEnemy,
    refreshEnemy,
    refreshKillCount,
    setLogEntry,
  };
});
