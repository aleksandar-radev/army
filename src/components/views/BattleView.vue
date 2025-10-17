<template>
  <section class="card">
    <header class="card__header">
      <div>
        <p class="card__eyebrow">
          {{ t('battle.currentEnemy') }}
        </p>
        <h2 class="card__title">
          {{ enemyLevelLabel }}
        </h2>
      </div>
      <div class="stats">
        <div class="stat">
          <p class="stat__label">
            {{ t('battle.stats.health') }}
          </p>
          <p class="stat__value">
            {{ formatFloat(enemyDetails?.currentHp) }} / {{ formatFloat(enemyDetails?.maxHp) }}
          </p>
        </div>
        <div class="stat">
          <p class="stat__label">
            {{ t('battle.stats.damage') }}
          </p>
          <p class="stat__value">
            {{ formatFloat(enemyDetails?.dmg) }}
          </p>
        </div>
        <div class="stat">
          <p class="stat__label">
            {{ t('battle.stats.kills') }}
          </p>
          <p class="stat__value">
            {{ formatNumber(killCount) }}
          </p>
        </div>
      </div>
    </header>

    <div class="card__body">
      <div class="controls">
        <button
          class="attack-button"
          type="button"
          :class="{ 'attack-button--active': isAttacking }"
          :disabled="isAttacking"
          @click="beginAttack"
        >
          {{ t('battle.attackButton') }}
        </button>
        <button
          class="stop-button"
          type="button"
          :disabled="!isAttacking"
          @click="stopAttack"
        >
          {{ t('battle.stopButton') }}
        </button>
      </div>
    </div>
  </section>
  <section class="log-card">
    <h3 class="log-card__title">
      {{ t('battle.logTitle') }}
    </h3>
    <ul class="log-list">
      <li
        v-for="(entry, index) in battleLog"
        :key="index"
        class="log-list__entry"
      >
        <pre>{{ entry }}</pre>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBattleStore } from '@/stores/battleStore.js';
import { useI18nStore } from '@/stores/i18nStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';

const battle = useBattleStore();
const i18n = useI18nStore();
const t = i18n.t;
const { currentEnemy, killCount, battleLog } = storeToRefs(battle);

const enemyDetails = computed(() => currentEnemy.value);
const enemyLevelLabel = computed(() => {
  const level = enemyDetails.value?.level;
  if (!level) {
    return t('common.level', { value: '-' });
  }
  return t('common.level', { value: formatNumber(level) });
});
const isAttacking = ref(false);
let attackInterval = null;

const attack = () => {
  battle.attackEnemy();
};

const beginAttack = () => {
  if (isAttacking.value) return;
  isAttacking.value = true;
  attack();
  attackInterval = setInterval(attack, 1000);
};

const stopAttack = () => {
  if (!isAttacking.value) return;
  isAttacking.value = false;
  if (attackInterval) {
    clearInterval(attackInterval);
    attackInterval = null;
  }
};

onMounted(() => {
  battle.refreshEnemy();
});

onBeforeUnmount(() => {
  stopAttack();
});
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.card__eyebrow {
  margin: 0;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: rgba(148, 163, 184, 0.7);
}

.card__title {
  margin: 8px 0 0;
  font-size: 2rem;
  font-weight: 700;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat {
  background: rgba(15, 23, 42, 0.6);
  padding: 14px 16px;
  border-radius: 16px;
  min-width: 120px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.stat__label {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat__value {
  margin: 8px 0 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.card__body {
  display: flex;
  justify-content: flex-start;
}

.controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.attack-button {
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 18px;
  padding: 20px;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.85));
  color: #fff;
  box-shadow: 0 18px 40px rgba(59, 130, 246, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.attack-button--active {
  transform: translateY(2px) scale(0.99);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.45);
}

.attack-button:hover {
  transform: translateY(-1px);
}

.attack-button:disabled {
  cursor: not-allowed;
  opacity: 0.75;
  transform: none;
}

.stop-button {
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 18px;
  padding: 20px;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.9), rgba(220, 38, 38, 0.85));
  color: #fff;
  box-shadow: 0 18px 40px rgba(248, 113, 113, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stop-button:hover {
  transform: translateY(-1px);
}

.stop-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.log-card {
  margin-top: 24px;
  background: rgba(15, 23, 42, 0.55);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.log-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-list__entry pre {
  margin: 0;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 14px;
  padding: 16px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  white-space: pre-wrap;
  border: 1px solid rgba(148, 163, 184, 0.12);
  color: rgba(226, 232, 240, 0.9);
}

@media (max-width: 900px) {
  .card__body {
    justify-content: center;
  }
}
</style>
