import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { attack, getCurrentEnemy, getKillCount, startNewBattle } from '@/game/battle.js';
import { useEconomyStore } from '@/stores/economyStore.js';

const formatEnemy = (enemy) => {
  if (!enemy) return null;
  return {
    level: enemy.getLevel(),
    currentHp: enemy.getCurrentHp(),
    maxHp: enemy.getMaxHp(),
    dmg: enemy.getDmg(),
  };
};

export const useBattleStore = defineStore('battle', () => {
  const enemy = ref(formatEnemy(getCurrentEnemy()));
  const killCount = ref(getKillCount());
  const battleLog = ref('Tap and hold Attack to fight the enemy.');

  const currentEnemy = computed(() => enemy.value);

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
      battleLog.value = `Enemy defeated! You gained ${result.storedSoulsGained.toFixed(1)} hero souls.`;
      const nextEnemy = startNewBattle();
      setEnemy(nextEnemy);
    } else {
      const { enemyHpAfterAttack, retaliation } = result;
      let log = `You dealt damage. Enemy HP is now ${enemyHpAfterAttack.toFixed(1)}.\n`;
      if (retaliation.type) {
        if (retaliation.unitsLost > 0) {
          log += `Enemy retaliated and killed ${retaliation.unitsLost} ${retaliation.type}${
            retaliation.unitsLost > 1 ? 's' : ''
          }.`;
        } else {
          log += `Enemy retaliated but did not kill any ${retaliation.type}.`;
        }
      } else {
        log += 'Enemy could not retaliate (no units).';
      }
      battleLog.value = log;
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
  };
});
