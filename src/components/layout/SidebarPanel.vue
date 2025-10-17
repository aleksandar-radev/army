<template>
  <aside class="panel">
    <header class="panel__header">
      <h1 class="title">Idle Army Builder</h1>
      <p class="subtitle">Commanders Dashboard</p>
    </header>

    <section class="summary">
      <div class="summary__item" v-for="item in summaryItems" :key="item.label">
        <p class="summary__label">{{ item.label }}</p>
        <p class="summary__value">{{ item.value }}</p>
      </div>
    </section>

    <nav class="nav">
      <button
        v-for="item in navItems"
        :key="item.key"
        :class="['nav__button', { 'nav__button--active': activeTab === item.key }]"
        type="button"
        @click="setActiveTab(item.key)"
      >
        <span class="nav__icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <footer class="footer">
      <button class="reset-button" type="button" @click="openResetModal">
        Reset Progress
      </button>
    </footer>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { useUiStore } from '@/stores/uiStore.js';
import { formatNumber } from '@/utils/formatters.js';

const navItems = [
  { key: 'battle', label: 'Battle', icon: '⚔️' },
  { key: 'army', label: 'Army', icon: '🛡️' },
  { key: 'town', label: 'Town', icon: '🏙️' },
  { key: 'prestige', label: 'Prestige', icon: '🌟' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
];

const economy = useEconomyStore();
const ui = useUiStore();
const { activeTab } = storeToRefs(ui);
const { resourceSummary } = storeToRefs(economy);

const summaryItems = computed(() => [
  { label: 'Gold', value: formatNumber(resourceSummary.value.gold) },
  { label: 'Stored Souls', value: formatNumber(resourceSummary.value.heroSoulsStored) },
  { label: 'Total Souls', value: formatNumber(resourceSummary.value.heroSoulsTotal) },
  { label: 'Prestiges', value: formatNumber(resourceSummary.value.prestigeCount) },
]);

const setActiveTab = ui.setActiveTab;
const openResetModal = ui.openResetModal;
</script>

<style scoped>
.panel {
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.95), rgba(30, 64, 175, 0.4));
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.4);
}

.panel__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.subtitle {
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
  font-size: 0.95rem;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.summary__item {
  padding: 16px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.summary__label {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.8);
}

.summary__value {
  margin: 8px 0 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav__button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(15, 23, 42, 0.6);
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav__button:hover {
  border-color: rgba(59, 130, 246, 0.6);
  transform: translateX(4px);
}

.nav__button--active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.35);
}

.nav__icon {
  font-size: 1.4rem;
}

.footer {
  margin-top: auto;
  display: flex;
}

.reset-button {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(190, 24, 93, 0.9));
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reset-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.35);
}
</style>
