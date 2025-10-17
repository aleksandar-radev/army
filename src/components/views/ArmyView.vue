<template>
  <section class="card army-view">
    <header class="card__header">
      <h2 class="card__title">
        {{ t('army.title') }}
      </h2>
      <p class="card__subtitle">
        {{ t('army.subtitle') }}
      </p>
    </header>

    <div class="army-scroll">
      <div
        v-if="armyCards.length"
        class="grid"
      >
        <article
          v-for="card in armyCards"
          :key="card.type"
          class="unit-card"
        >
          <header class="unit-card__header">
            <span class="unit-card__icon">
              <img
                :src="card.iconSrc"
                alt=""
                aria-hidden="true"
                class="icon-image"
              >
            </span>
            <div class="unit-card__heading">
              <h3 class="unit-card__title">
                {{ card.name }}
              </h3>
              <span
                class="unit-card__count"
                :aria-label="`${t('army.stats.totalUnits')}: ${formatNumber(card.count)}`"
              >
                <span class="unit-card__count-label">{{ t('army.stats.totalUnits') }}</span>
                <span class="unit-card__count-value">{{ formatNumber(card.count) }}</span>
              </span>
            </div>
          </header>
          <dl class="unit-card__stats">
            <div>
              <dt>{{ t('army.stats.healthPerUnit') }}</dt>
              <dd>{{ formatFloat(card.perHp) }}</dd>
            </div>
            <div>
              <dt>{{ t('army.stats.damagePerUnit') }}</dt>
              <dd>{{ formatFloat(card.perDmg) }}</dd>
            </div>
            <div>
              <dt>{{ t('army.stats.totalHealth') }}</dt>
              <dd>{{ formatNumber(card.totalHp) }}</dd>
            </div>
            <div>
              <dt>{{ t('army.stats.totalDamage') }}</dt>
              <dd>{{ formatNumber(card.totalDmg) }}</dd>
            </div>
          </dl>
        </article>
      </div>
      <p
        v-else
        class="empty"
      >
        {{ t('army.empty') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';

const economy = useEconomyStore();
const { armyCards } = storeToRefs(economy);
const i18n = useI18nStore();
const t = i18n.t;
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.army-view {
  flex: 1;
  min-height: 0;
}

.army-scroll {
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
  min-width: 0;
}

.unit-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
}

.unit-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.unit-card__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 12px;
}

.unit-card__icon {
  font-size: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.unit-card__title {
  margin: 0;
  font-size: 1.3rem;
}

.unit-card__count {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(148, 163, 184, 0.85);
}

.unit-card__count-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
}

.unit-card__count-value {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.unit-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 18px;
  margin: 0;
}

.unit-card__stats div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.unit-card__stats dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.75);
}

.unit-card__stats dd {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.empty {
  margin: 0;
  padding: 24px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px dashed rgba(148, 163, 184, 0.3);
  color: rgba(148, 163, 184, 0.9);
  text-align: center;
}
</style>
