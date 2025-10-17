<template>
  <section class="card">
    <header class="card__header">
      <h2 class="card__title">
        Town Development
      </h2>
      <p class="card__subtitle">
        Upgrade buildings to unlock faster progression and recruitment.
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
              {{ building.key }}
            </h3>
            <p class="building__level">
              Level {{ formatNumber(building.level) }}
            </p>
          </div>
        </div>
        <button
          class="upgrade"
          type="button"
          :disabled="!building.canAfford"
          @click="upgrade(building.key)"
        >
          Upgrade • {{ formatNumber(building.cost) }} gold
        </button>
      </article>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatNumber } from '@/utils/formatters.js';

const economy = useEconomyStore();
const { townBuildings } = storeToRefs(economy);

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
