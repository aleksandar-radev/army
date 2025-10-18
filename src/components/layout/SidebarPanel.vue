<template>
  <aside class="panel">
    <header class="panel__header">
      <h1 class="title">
        {{ t('sidebar.title') }}
      </h1>
    </header>

    <section class="summary">
      <div
        v-for="item in summaryItems"
        :key="item.key"
        class="summary__item"
      >
        <p class="summary__label">
          {{ item.label }}
        </p>
        <p class="summary__value">
          {{ item.value }}
        </p>
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
        <span class="nav__icon">
          <img
            :src="item.iconSrc"
            alt=""
            aria-hidden="true"
            class="icon-image"
          >
        </span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { useUiStore } from '@/stores/uiStore.js';
import { formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';
import { defaultNavIconSrc, navIconSources } from '@/constants/iconSources.js';

const economy = useEconomyStore();
const ui = useUiStore();
const i18n = useI18nStore();
const t = i18n.t;
const { activeTab } = storeToRefs(ui);
const { resourceSummary } = storeToRefs(economy);

const navItems = computed(() =>
  Object.entries({
    battle: 'sidebar.nav.battle',
    army: 'sidebar.nav.army',
    town: 'sidebar.nav.town',
    prestige: 'sidebar.nav.prestige',
    achievements: 'sidebar.nav.achievements',
    options: 'sidebar.nav.options',
  }).map(([key, translationKey]) => ({
    key,
    label: t(translationKey),
    iconSrc: navIconSources[key] || defaultNavIconSrc,
  })),
);

const summaryItems = computed(() => [
  { key: 'gold', label: t('sidebar.summary.gold'), value: formatNumber(resourceSummary.value.gold) },
]);

const setActiveTab = ui.setActiveTab;
</script>

<style scoped>
.panel {
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.95), rgba(30, 64, 175, 0.4));
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.4);
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  width: 100%;
  min-width: 0;
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
  display: inline-flex;
  align-items: center;
}
</style>
