<template>
  <section class="card">
    <header class="card__header">
      <h2 class="card__title">
        Army Composition
      </h2>
      <p class="card__subtitle">
        Detailed breakdown of your units and their power.
      </p>
    </header>

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
          <span class="unit-card__icon">{{ card.icon }}</span>
          <h3 class="unit-card__title">
            {{ card.type }}
          </h3>
        </header>
        <dl class="unit-card__stats">
          <div>
            <dt>Total Units</dt>
            <dd>{{ formatNumber(card.count) }}</dd>
          </div>
          <div>
            <dt>Health / unit</dt>
            <dd>{{ formatFloat(card.perHp) }}</dd>
          </div>
          <div>
            <dt>Damage / unit</dt>
            <dd>{{ formatFloat(card.perDmg) }}</dd>
          </div>
          <div>
            <dt>Total Health</dt>
            <dd>{{ formatNumber(card.totalHp) }}</dd>
          </div>
          <div>
            <dt>Total Damage</dt>
            <dd>{{ formatNumber(card.totalDmg) }}</dd>
          </div>
        </dl>
      </article>
    </div>
    <p
      v-else
      class="empty"
    >
      Recruit units in battle to populate your army.
    </p>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';

const economy = useEconomyStore();
const { armyCards } = storeToRefs(economy);
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
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

.unit-card__icon {
  font-size: 2rem;
}

.unit-card__title {
  margin: 0;
  font-size: 1.3rem;
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
