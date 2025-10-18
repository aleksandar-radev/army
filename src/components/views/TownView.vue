<template>
  <section class="card town-view">
    <header class="card__header">
      <h2 class="card__title">
        {{ t('town.title') }}
      </h2>
      <p class="card__subtitle">
        {{ t('town.subtitle') }}
      </p>
    </header>

    <div class="town-scroll">
      <div
        v-if="townBuildings.length"
        class="grid"
      >
        <article
          v-for="building in townBuildings"
          :key="building.key"
          class="building"
        >
          <div class="building__header">
            <span class="building__icon">
              <img
                :src="building.iconSrc"
                :alt="building.name"
                class="icon-image"
              >
            </span>
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
                <img
                  :src="INFO_ICON_SRC"
                  alt=""
                  aria-hidden="true"
                  class="icon-image"
                >
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
          <div
            v-if="building.spawn"
            class="building__progress"
          >
            <div class="building__progress-top">
              <span class="building__progress-label">
                {{ building.spawn.label }}
              </span>
              <span class="building__progress-percent">
                {{ building.spawn.progressPercent }}%
              </span>
            </div>
            <div
              class="building__progress-bar"
              role="progressbar"
              :aria-label="building.spawn.ariaLabel"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="building.spawn.progressPercent"
            >
              <div
                class="building__progress-fill"
                :style="{ width: `${building.spawn.progressPercent}%` }"
              />
            </div>
            <p class="building__progress-status">
              {{ building.spawn.statusText }}
            </p>
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
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';
import { uiIconSources } from '@/constants/iconSources.js';

const economy = useEconomyStore();
const { townBuildings } = storeToRefs(economy);
const i18n = useI18nStore();
const t = i18n.t;

const INFO_ICON_SRC = uiIconSources.info;

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

.town-view {
  flex: 1;
  min-height: 0;
}

.town-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
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
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 20px;
  width: 100%;
  min-width: 0;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  min-width: 0;
  margin: 0;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.building__progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.building__progress-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(148, 163, 184, 0.9);
}

.building__progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.8);
  overflow: hidden;
}

.building__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.9), rgba(59, 130, 246, 0.9));
  transition: width 0.3s ease;
}

.building__progress-status {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.95);
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
  inset: auto 0 100% auto;
  transform: translateY(-8px);
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
  right: 14px;
  border-width: 6px;
  border-style: solid;
  border-color: rgba(15, 23, 42, 0.96) transparent transparent transparent;
}

.tooltip__trigger:focus + .tooltip__bubble,
.tooltip__trigger:focus-visible + .tooltip__bubble,
.tooltip__trigger:hover + .tooltip__bubble {
  opacity: 1;
  transform: translateY(-14px);
}

.upgrade {
  margin-top: auto;
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
