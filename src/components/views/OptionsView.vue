<template>
  <section class="card">
    <header class="card__header">
      <h2 class="card__title">
        {{ t('options.title') }}
      </h2>
      <p class="card__subtitle">
        {{ t('options.subtitle') }}
      </p>
    </header>

    <div class="options">
      <div class="field">
        <label
          class="field__label"
          for="language-select"
        >
          {{ t('options.languageLabel') }}
        </label>
        <p class="field__description">
          {{ t('options.languageDescription') }}
        </p>
        <select
          id="language-select"
          v-model="selectedLocale"
          class="field__select"
        >
          <option
            v-for="option in localeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="field field--community">
        <div class="field__text">
          <p class="field__label">
            {{ t('options.communityLabel') }}
          </p>
          <p class="field__description">
            {{ t('options.communityDescription') }}
          </p>
        </div>
        <a
          class="field__button"
          href="https://discord.gg/8rgwg2zzqc"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('options.discordButton') }}
        </a>
      </div>

      <div class="field field--reset">
        <div class="field__text">
          <p class="field__label">
            {{ t('options.resetLabel') }}
          </p>
          <p class="field__description">
            {{ t('options.resetDescription') }}
          </p>
        </div>
        <button
          class="field__button"
          type="button"
          @click="openResetModal"
        >
          {{ t('options.resetButton') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18nStore } from '@/stores/i18nStore.js';
import { useUiStore } from '@/stores/uiStore.js';

const i18n = useI18nStore();
const ui = useUiStore();
const { locale } = storeToRefs(i18n);
const t = i18n.t;

const localeOptions = computed(() =>
  i18n.localeLabels.map((option) => ({
    value: option.value,
    label: option.label,
  })),
);

const selectedLocale = computed({
  get: () => locale.value,
  set: (value) => {
    i18n.setLocale(value);
  },
});

const openResetModal = ui.openResetModal;
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

.options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field--community {
  gap: 16px;
}

.field--reset {
  gap: 16px;
}

.field__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.95);
}

.field__description {
  margin: 0;
  color: rgba(148, 163, 184, 0.85);
  font-size: 0.9rem;
}

.field__select {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 1rem;
  appearance: none;
}

.field__select:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.field__button {
  align-self: flex-start;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(190, 24, 93, 0.9));
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.field__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.35);
}
</style>
