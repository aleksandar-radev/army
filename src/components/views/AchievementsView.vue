<template>
  <section class="card">
    <header class="card__header">
      <h2 class="card__title">Achievements</h2>
      <p class="card__subtitle">
        {{ achievementsSummary.unlockedCount }} / {{ achievementsSummary.total }} milestones unlocked.
      </p>
    </header>

    <div class="grid">
      <article class="achievement" v-for="achievement in achievementsSummary.list" :key="achievement.name">
        <header class="achievement__header">
          <h3 class="achievement__title">{{ achievement.name }}</h3>
          <span class="achievement__status" :class="{ 'achievement__status--complete': achievement.unlocked }">
            {{ achievement.unlocked ? 'Unlocked' : 'Locked' }}
          </span>
        </header>
        <p class="achievement__description">{{ achievement.description }}</p>
        <div class="progress">
          <div class="progress__bar" :style="{ width: `${achievement.percent}%` }"></div>
        </div>
        <footer class="achievement__footer">
          <span>{{ formatNumber(achievement.progress) }} / {{ formatNumber(achievement.value) }}</span>
          <span>{{ achievement.percent.toFixed(1) }}%</span>
        </footer>
      </article>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatNumber } from '@/utils/formatters.js';

const economy = useEconomyStore();
const { achievements } = storeToRefs(economy);

const achievementsSummary = achievements;
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

.achievement {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(59, 130, 246, 0.15);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.achievement__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement__title {
  margin: 0;
  font-size: 1.2rem;
}

.achievement__status {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
  color: rgba(148, 163, 184, 0.9);
  font-size: 0.85rem;
}

.achievement__status--complete {
  background: rgba(34, 197, 94, 0.2);
  color: rgba(74, 222, 128, 0.9);
}

.achievement__description {
  margin: 0;
  color: rgba(148, 163, 184, 0.85);
  min-height: 48px;
}

.progress {
  height: 8px;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.progress__bar {
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9));
  transition: width 0.3s ease;
}

.achievement__footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.8);
}
</style>
