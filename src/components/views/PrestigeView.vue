<template>
  <section class="card prestige-view">
    <header class="card__header">
      <h2 class="card__title">
        {{ t('prestige.title') }}
      </h2>
      <p class="card__subtitle">
        {{ t('prestige.subtitle') }}
      </p>
    </header>

    <div class="prestige-scroll">
      <div class="prestige">
        <div class="prestige__summary">
          <div class="summary-row">
            <span>{{ t('prestige.summary.storedSouls') }}</span>
            <strong>{{ formatNumber(resourceSummary.heroSoulsStored) }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ t('prestige.summary.totalSouls') }}</span>
            <strong>{{ formatNumber(resourceSummary.heroSoulsTotal) }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ t('prestige.summary.prestigeCount') }}</span>
            <strong>{{ formatNumber(resourceSummary.prestigeCount) }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ t('prestige.summary.killsThisRun') }}</span>
            <strong>{{ formatNumber(prestigeInfo.currentKills) }}</strong>
          </div>
          <div class="summary-row">
            <span>{{ t('prestige.summary.killsRequired') }}</span>
            <strong>{{ formatNumber(prestigeInfo.requiredKills) }}</strong>
          </div>
          <div class="actions">
            <button
              type="button"
              class="prestige-btn"
              :disabled="!canPrestigeNow"
              @click="performPrestige"
            >
              {{ t('prestige.actions.prestigeNow') }}
            </button>
            <button
              v-if="ascendVisible"
              type="button"
              class="ascend-btn"
              :disabled="ascendDisabled"
              @click="ascend"
            >
              {{ t('prestige.actions.ascend') }}
            </button>
          </div>
          <p
            v-if="ascendMessage"
            class="ascend-message"
          >
            {{ ascendMessage }}
          </p>
        </div>

        <div class="relics">
          <h3 class="relics__title">
            {{ t('prestige.relicsTitle') }}
          </h3>
          <div class="relics__grid">
            <article
              v-for="relic in relics"
              :key="relic.key"
              class="relic"
            >
              <header class="relic__header">
                <span class="relic__icon">{{ relic.icon }}</span>
                <h4 class="relic__title">
                  {{ relic.name }}
                </h4>
              </header>
              <p class="relic__tier">
                {{ t('prestige.tier', { value: formatNumber(relic.tier) }) }}
              </p>
              <p
                v-if="relic.description.summary"
                class="relic__summary"
              >
                {{ relic.description.summary }}
              </p>
              <p
                v-if="relic.description.detail"
                class="relic__detail"
              >
                {{ relic.description.detail }}
              </p>
              <button
                class="relic__upgrade"
                type="button"
                :disabled="relic.maxed || !relic.affordable"
                @click="upgradeRelic(relic.key)"
              >
                {{ relic.maxed
                  ? t('prestige.relicUpgrade.maxed')
                  : t('prestige.relicUpgrade.cost', { cost: formatNumber(relic.cost) })
                }}
              </button>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { useProgressionStore } from '@/stores/progressionStore.js';
import { formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';

const economy = useEconomyStore();
const progression = useProgressionStore();
const i18n = useI18nStore();
const t = i18n.t;

const { resourceSummary, relics } = storeToRefs(economy);
const { prestigeInfo, canPrestigeNow, ascendMessage, ascendVisible, ascendDisabled } =
  storeToRefs(progression);

const performPrestige = () => {
  progression.performPrestige();
};

const upgradeRelic = (key) => {
  economy.upgradeRelic(key);
};

const ascend = () => {
  progression.ascend();
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.prestige-view {
  flex: 1;
  min-height: 0;
}

.prestige-scroll {
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

.prestige {
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: stretch;
  width: 100%;
}

.prestige__summary {
  background: rgba(15, 23, 42, 0.65);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.85);
}

.summary-row strong {
  font-weight: 600;
  font-size: 1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.prestige-btn,
.ascend-btn {
  padding: 14px 16px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.prestige-btn {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.85));
  color: #fff;
  box-shadow: 0 14px 34px rgba(59, 130, 246, 0.35);
}

.prestige-btn:disabled,
.ascend-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  background: rgba(15, 23, 42, 0.7);
  color: rgba(148, 163, 184, 0.7);
}

.ascend-btn {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.9), rgba(245, 158, 11, 0.9));
  color: #111827;
  box-shadow: 0 14px 34px rgba(251, 191, 36, 0.35);
}

.prestige-btn:not(:disabled):hover,
.ascend-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.ascend-message {
  margin: 0;
  font-size: 0.95rem;
  color: #fbbf24;
  text-align: center;
}

.relics {
  background: rgba(15, 23, 42, 0.55);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.relics__title {
  margin: 0 0 16px;
}

.relics__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.relic {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.relic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.relic__icon {
  font-size: 1.8rem;
}

.relic__title {
  margin: 0;
  font-size: 1.05rem;
}

.relic__tier {
  margin: 0;
  color: rgba(148, 163, 184, 0.85);
}

.relic__summary {
  margin: 0;
  color: rgba(226, 232, 240, 0.85);
  font-size: 0.95rem;
}

.relic__detail {
  margin: 0;
  color: rgba(148, 163, 184, 0.85);
  font-size: 0.9rem;
}

.relic__upgrade {
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.25);
  color: rgba(226, 232, 240, 0.95);
  transition: transform 0.15s ease, background 0.15s ease;
}

.relic__upgrade:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.relic__upgrade:not(:disabled):hover {
  transform: translateY(-1px);
  background: rgba(59, 130, 246, 0.45);
}
</style>
