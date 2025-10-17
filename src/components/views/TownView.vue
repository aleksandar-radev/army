<template>
  <section class="card">
    <header class="card__header">
      <h2 class="card__title">
        {{ t('town.title') }}
      </h2>
      <p class="card__subtitle">
        {{ t('town.subtitle') }}
      </p>
    </header>

    <div class="grid">
      <article
        v-for="building in townBuildings"
        :key="building.key"
        class="building"
      >
        <div class="building__header">
          <span class="building__icon">{{ building.icon }}</span>
          <div>
            <h3 class="building__title">
              {{ building.name }}
            </h3>
            <p class="building__level">
              {{ t('town.level', { value: formatNumber(building.level) }) }}
            </p>
          </div>
        </div>
        <div
          v-if="building.description.summary || building.description.detail"
          class="building__description"
        >
          <p
            v-if="building.description.summary"
            :id="`${building.key}-summary`"
            class="building__summary"
          >
            {{ building.description.summary }}
          </p>
          <div
            v-if="building.description.detail"
            class="tooltip"
          >
            <button
              class="tooltip__trigger"
              type="button"
              :aria-describedby="`${building.key}-details`"
              :aria-label="t('town.tooltipMoreDetails', { name: building.name })"
            >
              ℹ️
            </button>
            <div
              :id="`${building.key}-details`"
              class="tooltip__bubble"
              role="tooltip"
            >
              {{ building.description.detail }}
            </div>
          </div>
        </div>
        <button
          class="upgrade"
          type="button"
          :disabled="!building.canAfford"
          :aria-label="t('town.upgradeAria', { name: building.name, cost: formatNumber(building.cost) })"
          :aria-describedby="building.description.summary ? `${building.key}-summary` : null"
          @click="upgrade(building.key)"
        >
          {{ t('town.upgradeButton', { cost: formatNumber(building.cost) }) }}
        </button>
      </article>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';

const economy = useEconomyStore();
const { townBuildings } = storeToRefs(economy);
const i18n = useI18nStore();
const t = i18n.t;

const upgrade = (key) => {
  economy.upgradeTownBuilding(key);
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card__title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.card__subtitle {
  margin: 0;
  color: rgba(148, 163, 184, 0.8);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.building {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.building__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.building__icon {
  font-size: 2.4rem;
}

.building__title {
  margin: 0;
  font-size: 1.3rem;
}

.building__level {
  margin: 4px 0 0;
  color: rgba(148, 163, 184, 0.8);
}

.building__description {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: rgba(226, 232, 240, 0.95);
}

.building__summary {
  flex: 1;
  margin: 0;
  line-height: 1.4;
}

.tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip__trigger {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: none;
  background: rgba(59, 130, 246, 0.18);
  color: #bfdbfe;
  cursor: help;
  transition: background 0.15s ease, color 0.15s ease;
}

.tooltip__trigger:focus-visible,
.tooltip__trigger:hover {
  background: rgba(59, 130, 246, 0.3);
  color: #fff;
}

.tooltip__bubble {
  position: absolute;
  inset: auto auto 100% 50%;
  transform: translate(-50%, -8px);
  min-width: 220px;
  max-width: 260px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.96);
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.35);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 2;
}

.tooltip__bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: rgba(15, 23, 42, 0.96) transparent transparent transparent;
}

.tooltip__trigger:focus + .tooltip__bubble,
.tooltip__trigger:focus-visible + .tooltip__bubble,
.tooltip__trigger:hover + .tooltip__bubble {
  opacity: 1;
  transform: translate(-50%, -14px);
}

.upgrade {
  padding: 14px 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.85), rgba(22, 163, 74, 0.85));
  box-shadow: 0 14px 34px rgba(34, 197, 94, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.upgrade:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: rgba(15, 23, 42, 0.7);
  box-shadow: none;
}

.upgrade:not(:disabled):hover {
  transform: translateY(-1px);
}
</style>
