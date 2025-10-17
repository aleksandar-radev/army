import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { TickConfig } from '@/game/config.js';
import { doPrestige } from '@/game/prestige.js';
import { clearSave, loadGame, startAutoSave, stopAutoSave } from '@/game/saveLoad.js';
import { getCurrentEnemy, startNewBattle } from '@/game/battle.js';
import { tickTown } from '@/game/town.js';
import { resetEngineState } from '@/stores/gameState.js';
import { useBattleStore } from '@/stores/battleStore.js';
import { useEconomyStore } from '@/stores/economyStore.js';
import { useUiStore } from '@/stores/uiStore.js';
import { useI18nStore } from '@/stores/i18nStore.js';
import { formatNumber } from '@/utils/formatters.js';

const ASCEND_TARGET = 1_000_000;
let tickHandle = null;
let ascendTimeout = null;

export const useProgressionStore = defineStore('progression', () => {
  const economy = useEconomyStore();
  const battle = useBattleStore();
  const ui = useUiStore();
  const i18n = useI18nStore();
  const t = i18n.t;

  const ascendMessageKey = ref(null);
  const ascendMessageParams = ref({});
  const ascendDisabled = ref(false);

  const ascendVisible = computed(
    () => ascendDisabled.value || (economy.resourcesView.heroSoulsTotal || 0) >= ASCEND_TARGET,
  );

  const canPrestigeNow = computed(() => true);

  const ascendMessage = computed(() =>
    ascendMessageKey.value ? t(ascendMessageKey.value, ascendMessageParams.value) : '',
  );

  const performPrestige = () => {
    if (!canPrestigeNow.value) return false;
    doPrestige();
    const nextEnemy = startNewBattle();
    battle.setEnemy(nextEnemy);
    battle.refreshKillCount();
    economy.sync();
    battle.setLogEntry({ type: 'status', key: 'battle.log.prestigeComplete' });
    return true;
  };

  const resetGame = () => {
    clearSave();
    const nextEnemy = resetEngineState();
    battle.setEnemy(nextEnemy);
    battle.refreshKillCount();
    economy.sync();
    battle.setLogEntry({ type: 'status', key: 'battle.log.gameReset' });
    if (ascendTimeout) {
      clearTimeout(ascendTimeout);
      ascendTimeout = null;
    }
    ascendMessageKey.value = null;
    ascendMessageParams.value = {};
    ascendDisabled.value = false;
    ui.closeResetModal();
  };

  const ascend = () => {
    if (ascendTimeout) {
      clearTimeout(ascendTimeout);
      ascendTimeout = null;
    }

    if ((economy.resourcesView.heroSoulsTotal || 0) >= ASCEND_TARGET) {
      ascendMessageKey.value = 'prestige.ascendMessage.complete';
      ascendMessageParams.value = {};
      ascendDisabled.value = true;
    } else {
      ascendMessageKey.value = 'prestige.ascendMessage.requirement';
      ascendMessageParams.value = { souls: formatNumber(ASCEND_TARGET) };
      ascendTimeout = setTimeout(() => {
        ascendMessageKey.value = null;
        ascendMessageParams.value = {};
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
    performPrestige,
    resetGame,
    ascend,
    initialize,
    dispose,
  };
});
