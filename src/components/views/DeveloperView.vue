<template>
  <section class="card">
    <header class="card__header">
      <h2 class="card__title">
        {{ t("devtools.title") }}
      </h2>
      <p class="card__subtitle">
        {{ t("devtools.subtitle") }}
      </p>
    </header>

    <div class="summary">
      <div class="summary__item">
        <p class="summary__label">
          {{ t("devtools.current.gold") }}
        </p>
        <p class="summary__value">
          {{ formatNumber(resourceSummary.gold) }}
        </p>
      </div>
      <div class="summary__item">
        <p class="summary__label">
          {{ t("devtools.current.storedSouls") }}
        </p>
        <p class="summary__value">
          {{ formatNumber(resourceSummary.heroSoulsStored) }}
        </p>
      </div>
      <div class="summary__item">
        <p class="summary__label">
          {{ t("devtools.current.totalSouls") }}
        </p>
        <p class="summary__value">
          {{ formatNumber(resourceSummary.heroSoulsTotal) }}
        </p>
      </div>
    </div>

    <div class="controls">
      <form
        class="control"
        @submit.prevent="applyGold"
      >
        <div class="control__text">
          <h3 class="control__title">
            {{ t("devtools.gold.title") }}
          </h3>
          <p class="control__description">
            {{ t("devtools.gold.description") }}
          </p>
        </div>
        <div class="control__actions">
          <input
            v-model.number="goldAmount"
            class="control__input"
            type="number"
            :min="0"
            step="1"
          >
          <button
            class="control__button"
            type="submit"
          >
            {{ t("devtools.gold.button") }}
          </button>
        </div>
      </form>

      <form
        class="control"
        @submit.prevent="applyStoredSouls"
      >
        <div class="control__text">
          <h3 class="control__title">
            {{ t("devtools.storedSouls.title") }}
          </h3>
          <p class="control__description">
            {{ t("devtools.storedSouls.description") }}
          </p>
        </div>
        <div class="control__actions">
          <input
            v-model.number="storedSoulAmount"
            class="control__input"
            type="number"
            :min="0"
            step="1"
          >
          <button
            class="control__button"
            type="submit"
          >
            {{ t("devtools.storedSouls.button") }}
          </button>
        </div>
      </form>

      <form
        class="control"
        @submit.prevent="applyTotalSouls"
      >
        <div class="control__text">
          <h3 class="control__title">
            {{ t("devtools.totalSouls.title") }}
          </h3>
          <p class="control__description">
            {{ t("devtools.totalSouls.description") }}
          </p>
        </div>
        <div class="control__actions">
          <input
            v-model.number="totalSoulAmount"
            class="control__input"
            type="number"
            :min="0"
            step="1"
          >
          <button
            class="control__button"
            type="submit"
          >
            {{ t("devtools.totalSouls.button") }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useEconomyStore } from "@/stores/economyStore.js";
import { useI18nStore } from "@/stores/i18nStore.js";
import { addGold, addHeroSoul, addHeroSoulsToTotal } from "@/game/resources.js";
import { formatNumber } from "@/utils/formatters.js";

const economy = useEconomyStore();
const { resourceSummary } = storeToRefs(economy);
const { sync } = economy;

const i18n = useI18nStore();
const t = i18n.t;

const goldAmount = ref(1000);
const storedSoulAmount = ref(100);
const totalSoulAmount = ref(100);

const sanitizeAmount = (value) => {
  if (typeof value !== "number") return 0;
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

const applyGold = () => {
  const amount = sanitizeAmount(goldAmount.value);
  if (!amount) return;
  addGold(amount);
  sync();
};

const applyStoredSouls = () => {
  const amount = sanitizeAmount(storedSoulAmount.value);
  if (!amount) return;
  addHeroSoul(amount);
  sync();
};

const applyTotalSouls = () => {
  const amount = sanitizeAmount(totalSoulAmount.value);
  if (!amount) return;
  addHeroSoulsToTotal(amount);
  sync();
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
  color: rgba(148, 163, 184, 0.85);
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.summary__item {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 18px;
  padding: 16px;
  border: 1px solid rgba(59, 130, 246, 0.25);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary__label {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.75);
}

.summary__value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.control__description {
  margin: 0;
  color: rgba(148, 163, 184, 0.8);
  font-size: 0.95rem;
}

.control__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.control__input {
  flex: 1;
  min-width: 160px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 12px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 1rem;
}

.control__input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.65);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.control__button {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.9),
    rgba(22, 163, 74, 0.9)
  );
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.control__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(34, 197, 94, 0.25);
}

.control__button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .controls {
    gap: 16px;
  }

  .control__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .control__button {
    width: 100%;
    text-align: center;
  }
}
</style>
