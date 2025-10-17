<template>
  <div class="app-shell">
    <div
      class="sidebar-wrapper"
      :class="{ 'sidebar-wrapper--mobile-open': mobileMenuOpen }"
    >
      <SidebarPanel />
    </div>
    <main class="main-area">
      <BattleView v-if="activeTab === 'battle'" />
      <ArmyView v-else-if="activeTab === 'army'" />
      <TownView v-else-if="activeTab === 'town'" />
      <PrestigeView v-else-if="activeTab === 'prestige'" />
      <AchievementsView v-else-if="activeTab === 'achievements'" />
      <OptionsView v-else />
    </main>
    <button
      class="mobile-menu-button"
      type="button"
      :aria-pressed="mobileMenuOpen"
      :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
      @click="toggleMobileMenu"
    >
      <img
        :src="mobileMenuOpen ? closeIconSrc : menuIconSrc"
        :alt="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        class="icon-image"
      />
    </button>
    <div
      v-if="mobileMenuOpen"
      class="sidebar-overlay"
      @click="closeMobileMenu"
    />
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
import { uiIconSources } from '@/constants/iconSources.js';

const menuIconSrc = uiIconSources.menu;
const closeIconSrc = uiIconSources.close;

const progression = useProgressionStore();
const ui = useUiStore();
const { activeTab, resetModalOpen, mobileMenuOpen } = storeToRefs(ui);
const { toggleMobileMenu, closeMobileMenu } = ui;

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
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  padding: 32px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  min-height: 0;
  align-items: stretch;
}

.sidebar-wrapper {
  height: 100%;
  min-height: 0;
  display: flex;
}

.sidebar-wrapper :deep(.panel) {
  flex: 1;
  min-height: 0;
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
  min-height: 0;
}

.mobile-menu-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.9));
  color: #fff;
  font-size: 1.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 40px rgba(59, 130, 246, 0.35);
  cursor: pointer;
}

.mobile-menu-button:active {
  transform: scale(0.96);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.75);
  z-index: 20;
}

@media (max-width: 1024px) {
  .app-shell {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .sidebar-wrapper {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    max-width: none;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 30;
    pointer-events: none;
  }

  .sidebar-wrapper--mobile-open {
    transform: translateX(0);
    pointer-events: auto;
  }

  .main-area {
    order: 1;
    padding: 24px;
  }

  .mobile-menu-button {
    display: inline-flex;
  }
}

@media (max-width: 640px) {
  .app-shell {
    padding: 16px;
  }

  .main-area {
    padding: 20px;
  }
}
</style>
