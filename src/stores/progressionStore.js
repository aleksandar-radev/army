import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { TickConfig } from '@/game/config.js';
import { canPrestige, doPrestige } from '@/game/prestige.js';
import { clearSave, loadGame, startAutoSave, stopAutoSave } from '@/game/saveLoad.js';
import { getCurrentEnemy, startNewBattle } from '@/game/battle.js';
import { tickTown } from '@/game/town.js';
import { resetEngineState, resourceState } from '@/stores/gameState.js';
import { useBattleStore } from '@/stores/battleStore.js';
import { useEconomyStore } from '@/stores/economyStore.js';
import { useUiStore } from '@/stores/uiStore.js';

const ASCEND_TARGET = 1_000_000;
let tickHandle = null;
let ascendTimeout = null;

export const useProgressionStore = defineStore('progression', () => {
  const economy = useEconomyStore();
  const battle = useBattleStore();
  const ui = useUiStore();

  const ascendMessage = ref('');
  const ascendDisabled = ref(false);

  const ascendVisible = computed(
    () => ascendDisabled.value || (economy.resourcesView.heroSoulsTotal || 0) >= ASCEND_TARGET,
  );

  const canPrestigeNow = computed(() => canPrestige());

  const prestigeInfo = computed(() => ({
    requiredKills: (resourceState.prestigeCount || 0) + 1,
    currentKills: battle.killCount.value,
  }));

  const performPrestige = () => {
    if (!canPrestige()) return false;
    doPrestige();
    const nextEnemy = startNewBattle();
    battle.setEnemy(nextEnemy);
    battle.refreshKillCount();
    economy.sync();
    battle.battleLog.value = 'Prestige complete! Fresh challenges await.';
    return true;
  };

  const resetGame = () => {
    clearSave();
    const nextEnemy = resetEngineState();
    battle.setEnemy(nextEnemy);
    battle.refreshKillCount();
    economy.sync();
    battle.battleLog.value = 'Game reset. Rebuild your army from scratch!';
    if (ascendTimeout) {
      clearTimeout(ascendTimeout);
      ascendTimeout = null;
    }
    ascendMessage.value = '';
    ascendDisabled.value = false;
    ui.closeResetModal();
  };

  const ascend = () => {
    if (ascendTimeout) {
      clearTimeout(ascendTimeout);
      ascendTimeout = null;
    }

    if ((economy.resourcesView.heroSoulsTotal || 0) >= ASCEND_TARGET) {
      ascendMessage.value = '🎉 Congratulations, you completed the game! 🎉';
      ascendDisabled.value = true;
    } else {
      ascendMessage.value = 'You need 1,000,000 hero souls to ascend!';
      ascendTimeout = setTimeout(() => {
        ascendMessage.value = '';
      }, 2000);
    }
  };

  const initialize = async () => {
    const loaded = await loadGame();

    if (!loaded) {
      const nextEnemy = resetEngineState();
      battle.setEnemy(nextEnemy);
      battle.refreshKillCount();
      economy.sync();
    } else {
      const currentEnemy = getCurrentEnemy() || startNewBattle();
      battle.setEnemy(currentEnemy);
      battle.refreshKillCount();
      economy.sync();
    }

    startAutoSave(1000);
    if (tickHandle) clearInterval(tickHandle);
    tickHandle = setInterval(() => {
      tickTown();
      economy.sync();
    }, TickConfig.intervalMs);
  };

  const dispose = () => {
    if (tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
    if (ascendTimeout) {
      clearTimeout(ascendTimeout);
      ascendTimeout = null;
    }
    stopAutoSave();
  };

  return {
    ascendMessage,
    ascendDisabled,
    ascendVisible,
    canPrestigeNow,
    prestigeInfo,
    performPrestige,
    resetGame,
    ascend,
    initialize,
    dispose,
  };
});
