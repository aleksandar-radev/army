<template>
  <section class="card">
    <header class="card__header">
      <div>
        <p class="card__eyebrow">
          Current Enemy
        </p>
        <h2 class="card__title">
          Level {{ enemyDetails?.level ?? '-' }}
        </h2>
      </div>
      <div class="stats">
        <div class="stat">
          <p class="stat__label">
            Health
          </p>
          <p class="stat__value">
            {{ formatFloat(enemyDetails?.currentHp) }} / {{ formatFloat(enemyDetails?.maxHp) }}
          </p>
        </div>
        <div class="stat">
          <p class="stat__label">
            Damage
          </p>
          <p class="stat__value">
            {{ formatFloat(enemyDetails?.dmg) }}
          </p>
        </div>
        <div class="stat">
          <p class="stat__label">
            Kills
          </p>
          <p class="stat__value">
            {{ formatNumber(killCount) }}
          </p>
        </div>
      </div>
    </header>

    <div class="card__body">
      <button
        class="attack-button"
        type="button"
        :class="{ 'attack-button--active': isAttacking }"
        @mousedown.prevent="beginAttack"
        @touchstart.prevent="beginAttack"
        @mouseup.prevent="stopAttack"
        @mouseleave="stopAttack"
        @touchend.prevent="stopAttack"
        @touchcancel.prevent="stopAttack"
      >
        Hold to Attack
      </button>
      <pre class="log">{{ battleLog }}</pre>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBattleStore } from '@/stores/battleStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';

const battle = useBattleStore();
const { currentEnemy, killCount, battleLog } = storeToRefs(battle);

const enemyDetails = computed(() => currentEnemy.value);
const isAttacking = ref(false);
let attackInterval = null;

const attack = () => {
  battle.attackEnemy();
};

const beginAttack = () => {
  if (isAttacking.value) return;
  isAttacking.value = true;
  attack();
  attackInterval = setInterval(attack, 100);
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
  window.addEventListener('mouseup', stopAttack);
  window.addEventListener('touchend', stopAttack);
  window.addEventListener('touchcancel', stopAttack);
  battle.refreshEnemy();
});

onBeforeUnmount(() => {
  stopAttack();
  window.removeEventListener('mouseup', stopAttack);
  window.removeEventListener('touchend', stopAttack);
  window.removeEventListener('touchcancel', stopAttack);
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
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: stretch;
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

.log {
  margin: 0;
  background: rgba(15, 23, 42, 0.55);
  border-radius: 18px;
  padding: 20px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  white-space: pre-wrap;
  border: 1px solid rgba(148, 163, 184, 0.1);
  color: rgba(226, 232, 240, 0.9);
}

@media (max-width: 900px) {
  .card__body {
    grid-template-columns: 1fr;
  }
}
</style>
