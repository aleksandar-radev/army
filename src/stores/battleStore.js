import { computed, ref, watch } from 'vue';
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
    return { kind: 'none', damage: 0 };
  }

  if (retaliation.unitsLost > 0) {
    return {
      kind: 'killed',
      unit: retaliation.type,
      count: retaliation.unitsLost,
      damage: retaliation.damageDealt,
    };
  }

  return {
    kind: 'noLoss',
    unit: retaliation.type,
    damage: retaliation.damageDealt,
  };
};

export const useBattleStore = defineStore('battle', () => {
  const enemy = ref(formatEnemy(getCurrentEnemy()));
  const killCount = ref(getKillCount());
  const isAttacking = ref(false);
  let attackInterval = null;

  const LOG_STORAGE_KEY = 'battleLogEntries';
  const isBrowser = typeof window !== 'undefined';

  const sanitizeLogEntries = (entries) => {
    if (!Array.isArray(entries)) return null;

    const sanitized = entries
      .filter((entry) => entry && typeof entry === 'object' && typeof entry.type === 'string')
      .map((entry) => ({ ...entry }));

    if (!sanitized.length) {
      return null;
    }

    return sanitized;
  };

  const loadLogEntries = () => {
    if (!isBrowser) return null;

    try {
      const storedValue = window.localStorage.getItem(LOG_STORAGE_KEY);
      if (!storedValue) return null;

      const parsed = JSON.parse(storedValue);
      return sanitizeLogEntries(parsed);
    } catch (error) {
      console.warn('Failed to parse stored battle log entries', error);
      return null;
    }
  };

  const saveLogEntries = (entries) => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to persist battle log entries', error);
    }
  };

  const defaultLogEntries = [{ type: 'instructions' }];
  const logEntries = ref(loadLogEntries() ?? defaultLogEntries);

  const i18n = useI18nStore();
  const t = i18n.t;

  const currentEnemy = computed(() => enemy.value);

  const formatLogEntry = (entry) => {
    if (!entry) return '';

    if (entry.type === 'instructions') {
      return t('battle.log.instructions');
    }

    if (entry.type === 'defeat') {
      const levelLabel = entry.enemyLevel ? formatNumber(entry.enemyLevel) : '-';
      const before = formatFloat(entry.enemyHpBefore, 1);
      const retaliationLines = [];
      const goldReward = Number.isFinite(entry.gold) ? entry.gold : 0;

      if (entry.retaliation) {
        const retaliation = entry.retaliation;
        if (retaliation.kind === 'killed') {
          const unitLabel = retaliation.count === 1
            ? t(`units.${retaliation.unit}.name`)
            : t(`units.${retaliation.unit}.plural`);
          retaliationLines.push(
            t('battle.log.retaliationKilled', {
              damage: formatFloat(retaliation.damage, 1),
              count: formatNumber(retaliation.count),
              unit: unitLabel,
            }),
          );
        } else if (retaliation.kind === 'noLoss') {
          const unitLabel = t(`units.${retaliation.unit}.plural`);
          retaliationLines.push(
            t('battle.log.retaliationNoLoss', {
              damage: formatFloat(retaliation.damage, 1),
              unit: unitLabel,
            }),
          );
        } else {
          retaliationLines.push(t('battle.log.noRetaliation'));
        }
      }

      const lines = [
        t('battle.log.heroAttack', {
          level: levelLabel,
          damage: formatFloat(entry.heroDamage, 1),
          before,
          after: formatFloat(entry.enemyHpAfter ?? 0, 1),
        }),
        ...retaliationLines,
        t('battle.log.heroVictory', {
          level: levelLabel,
          souls: formatFloat(entry.souls, 1),
          gold: formatNumber(goldReward),
        }),
      ];

      return lines.join('\n');
    }

    if (entry.type === 'exchange') {
      const levelLabel = entry.enemyLevel ? formatNumber(entry.enemyLevel) : '-';
      const lines = [
        t('battle.log.heroAttack', {
          level: levelLabel,
          damage: formatFloat(entry.heroDamage, 1),
          before: formatFloat(entry.enemyHpBefore, 1),
          after: formatFloat(entry.enemyHpAfter, 1),
        }),
      ];
      const retaliation = entry.retaliation || { kind: 'none', damage: 0 };
      if (retaliation.kind === 'killed') {
        const unitLabel = retaliation.count === 1
          ? t(`units.${retaliation.unit}.name`)
          : t(`units.${retaliation.unit}.plural`);
        lines.push(
          t('battle.log.retaliationKilled', {
            damage: formatFloat(retaliation.damage, 1),
            count: formatNumber(retaliation.count),
            unit: unitLabel,
          }),
        );
      } else if (retaliation.kind === 'noLoss') {
        const unitLabel = t(`units.${retaliation.unit}.plural`);
        lines.push(
          t('battle.log.retaliationNoLoss', {
            damage: formatFloat(retaliation.damage, 1),
            unit: unitLabel,
          }),
        );
      } else {
        lines.push(t('battle.log.noRetaliation'));
      }
      return lines.join('\n');
    }

    if (entry.type === 'status') {
      return t(entry.key, entry.params || {});
    }

    return '';
  };

  const battleLog = computed(() => {
    if (!logEntries.value.length) {
      return [formatLogEntry({ type: 'instructions' })];
    }

    return logEntries.value.map((entry) => formatLogEntry(entry));
  });

  const setLogEntry = (entry) => {
    if (entry.type === 'instructions') {
      logEntries.value = [entry];
      return;
    }

    if (logEntries.value.length === 1 && logEntries.value[0].type === 'instructions') {
      logEntries.value = [entry];
      return;
    }

    logEntries.value = [entry, ...logEntries.value].slice(0, 500);
  };

  const clearBattleLog = () => {
    logEntries.value = [{ type: 'instructions' }];
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

  watch(
    logEntries,
    (entries) => {
      saveLogEntries(entries);
    },
    { deep: true }
  );

  const stopAutoAttack = () => {
    isAttacking.value = false;
    if (attackInterval) {
      clearInterval(attackInterval);
      attackInterval = null;
    }
  };

  const attackEnemy = () => {
    const economy = useEconomyStore();
    const current = enemy.value;
    const result = attack();

    if (result.killed) {
      const retaliationState = createRetaliationState(result.retaliation);
      setLogEntry({
        type: 'defeat',
        souls: result.storedSoulsGained,
        gold: result.goldGained,
        heroDamage: result.heroDamage,
        enemyHpBefore: result.enemyHpBeforeAttack,
        enemyHpAfter: result.enemyHpAfterAttack,
        enemyLevel: current?.level ?? null,
        retaliation: retaliationState,
      });
      const nextEnemy = startNewBattle();
      setEnemy(nextEnemy);
    } else {
      const retaliationState = createRetaliationState(result.retaliation);
      setLogEntry({
        type: 'exchange',
        heroDamage: result.heroDamage,
        enemyHpBefore: result.enemyHpBeforeAttack,
        enemyHpAfter: result.enemyHpAfterAttack,
        retaliation: retaliationState,
        enemyLevel: current?.level ?? null,
      });
      refreshEnemy();
    }

    refreshKillCount();
    economy.sync();

    return result;
  };

  const startAutoAttack = () => {
    if (isAttacking.value) return;

    isAttacking.value = true;
    attackEnemy();
    attackInterval = setInterval(() => {
      attackEnemy();
    }, 1000);
  };

  return {
    currentEnemy,
    killCount,
    battleLog,
    isAttacking,
    startAutoAttack,
    stopAutoAttack,
    attackEnemy,
    setEnemy,
    refreshEnemy,
    refreshKillCount,
    setLogEntry,
    clearBattleLog,
  };
});
