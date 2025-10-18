<template>
  <div class="battle-view">
    <section class="card battle-card">
      <header class="card__header">
        <div class="card__header-top">
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
          <div class="enemy-summary">
            <span class="enemy-summary__label">
              {{ t('battle.currentEnemy') }}
            </span>
            <span class="enemy-summary__level">
              {{ enemyLevelLabel }}
            </span>
            <span class="enemy-summary__stat">
              <span class="enemy-summary__stat-label">
                {{ t('battle.stats.health') }}:
              </span>
              <span class="enemy-summary__stat-value">
                {{ formatFloat(enemyDetails?.currentHp) }} / {{ formatFloat(enemyDetails?.maxHp) }}
              </span>
            </span>
            <span class="enemy-summary__stat">
              <span class="enemy-summary__stat-label">
                {{ t('battle.stats.damage') }}:
              </span>
              <span class="enemy-summary__stat-value">
                {{ formatFloat(enemyDetails?.dmg) }}
              </span>
            </span>
            <span class="enemy-summary__stat">
              <span class="enemy-summary__stat-label">
                {{ t('battle.stats.kills') }}:
              </span>
              <span class="enemy-summary__stat-value">
                {{ formatNumber(killCount) }}
              </span>
            </span>
          </div>
        </div>
      </header>
    </section>
    <section class="log-card">
      <div class="army-summary">
        <span class="army-summary__label">
          {{ t('battle.yourArmy') }}
        </span>
        <div
          v-for="unit in armySummary"
          :key="unit.type"
          class="army-summary__item"
        >
          <img
            class="army-summary__icon"
            :src="unit.icon"
            :alt="unit.name"
            loading="lazy"
          >
          <span class="army-summary__count">
            {{ formatNumber(unit.count) }}
          </span>
        </div>
      </div>
      <div class="log-card__header">
        <h3 class="log-card__title">
          {{ t('battle.logTitle') }}
        </h3>
        <button
          class="log-card__clear"
          type="button"
          @click="clearBattleLog"
        >
          {{ t('battle.logClearButton') }}
        </button>
      </div>
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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useBattleStore } from '@/stores/battleStore.js';
import { useI18nStore } from '@/stores/i18nStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';
import { UnitTypes } from '@/game/config.js';
import { armyState } from '@/stores/gameState.js';
import defaultUnitIcon from '@/assets/icons/units/default.jpg';
import dragonIcon from '@/assets/icons/units/dragon.jpg';
import goblinIcon from '@/assets/icons/units/goblin.jpg';
import ogreIcon from '@/assets/icons/units/ogre.jpg';
import orcIcon from '@/assets/icons/units/orc.jpg';
import trollIcon from '@/assets/icons/units/troll.jpg';

const battle = useBattleStore();
const i18n = useI18nStore();
const t = i18n.t;
const { currentEnemy, killCount, battleLog, isAttacking } = storeToRefs(battle);
const { clearBattleLog, startAutoAttack, stopAutoAttack } = battle;

const enemyDetails = computed(() => currentEnemy.value);

const unitIcons = {
  Goblin: goblinIcon,
  Orc: orcIcon,
  Troll: trollIcon,
  Ogre: ogreIcon,
  Dragon: dragonIcon,
};

const armySummary = computed(() =>
  Object.keys(UnitTypes).map((type) => ({
    type,
    name: t(`units.${type}.plural`),
    icon: unitIcons[type] || defaultUnitIcon,
    count: armyState[type] || 0,
  })),
);

const enemyLevelLabel = computed(() => {
  const level = enemyDetails.value?.level;
  if (!level) {
    return t('common.level', { value: '-' });
  }
  return t('common.level', { value: formatNumber(level) });
});
const beginAttack = () => {
  startAutoAttack();
};

const stopAttack = () => {
  stopAutoAttack();
};

onMounted(() => {
  battle.refreshEnemy();
});
</script>

<style scoped>
.battle-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card__header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card__header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.enemy-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  text-align: right;
}

.enemy-summary__label {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.75);
  font-weight: 600;
}

.enemy-summary__level {
  font-size: 1.4rem;
  font-weight: 700;
}

.enemy-summary__stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 0.95rem;
}

.enemy-summary__stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.75);
  font-weight: 600;
}

.enemy-summary__stat-value {
  font-weight: 600;
  font-size: 1.05rem;
  color: rgba(226, 232, 240, 0.92);
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
  background: rgba(15, 23, 42, 0.55);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.log-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.log-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.log-card__clear {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: transparent;
  color: rgba(148, 163, 184, 0.9);
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.log-card__clear:hover,
.log-card__clear:focus-visible {
  outline: none;
  border-color: rgba(59, 130, 246, 0.6);
  color: #fff;
  background: rgba(59, 130, 246, 0.2);
}

.log-card__clear:active {
  background: rgba(59, 130, 246, 0.35);
}

.log-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
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

.army-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  margin-bottom: 12px;
}

.army-summary__label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.army-summary__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.army-summary__icon {
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
}

.army-summary__count {
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .card__header-top {
    justify-content: center;
  }
}
</style>
