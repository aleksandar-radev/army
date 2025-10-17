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
  const logEntries = ref([{ type: 'instructions' }]);

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
      const lines = [
        t('battle.log.heroAttack', {
          level: levelLabel,
          damage: formatFloat(entry.heroDamage, 1),
          before,
          after: formatFloat(entry.enemyHpAfter ?? 0, 1),
        }),
        t('battle.log.heroVictory', {
          level: levelLabel,
          souls: formatFloat(entry.souls, 1),
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
    const current = enemy.value;
    const result = attack();

    if (result.killed) {
      setLogEntry({
        type: 'defeat',
        souls: result.storedSoulsGained,
        heroDamage: result.heroDamage,
        enemyHpBefore: result.enemyHpBeforeAttack,
        enemyHpAfter: result.enemyHpAfterAttack,
        enemyLevel: current?.level ?? null,
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
