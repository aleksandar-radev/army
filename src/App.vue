<template>
  <div class="app-shell">
    <SidebarPanel class="sidebar" />
    <main class="main-area">
      <BattleView v-if="activeTab === 'battle'" />
      <ArmyView v-else-if="activeTab === 'army'" />
      <TownView v-else-if="activeTab === 'town'" />
      <PrestigeView v-else-if="activeTab === 'prestige'" />
      <AchievementsView v-else-if="activeTab === 'achievements'" />
      <OptionsView v-else />
    </main>
    <ResetModal v-if="resetModalOpen" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import SidebarPanel from '@/components/layout/SidebarPanel.vue';
import BattleView from '@/components/views/BattleView.vue';
import ArmyView from '@/components/views/ArmyView.vue';
import TownView from '@/components/views/TownView.vue';
import PrestigeView from '@/components/views/PrestigeView.vue';
import AchievementsView from '@/components/views/AchievementsView.vue';
import OptionsView from '@/components/views/OptionsView.vue';
import ResetModal from '@/components/modals/ResetModal.vue';
import { useProgressionStore } from '@/stores/progressionStore.js';
import { useUiStore } from '@/stores/uiStore.js';
import { trackEvent } from '@/utils/analytics.js';

const progression = useProgressionStore();
const ui = useUiStore();
const { activeTab, resetModalOpen } = storeToRefs(ui);

onMounted(() => {
  progression.initialize();
  trackEvent('game_loaded');
  trackEvent('tab_view', { tab: activeTab.value });
});

onBeforeUnmount(() => {
  progression.dispose();
});

watch(activeTab, (newTab, oldTab) => {
  if (newTab === oldTab) return;
  trackEvent('tab_view', { tab: newTab });
});

watch(resetModalOpen, (isOpen) => {
  if (!isOpen) return;
  trackEvent('modal_open', { modal: 'reset' });
});
</script>

<style scoped>
.app-shell {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  padding: 32px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.sidebar {
  height: 100%;
}

.main-area {
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.9));
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.45);
  overflow: hidden;
}

@media (max-width: 1024px) {
  .app-shell {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .sidebar {
    order: 2;
  }

  .main-area {
    order: 1;
  }
}
</style>
