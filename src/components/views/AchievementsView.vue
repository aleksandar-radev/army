<template>
  <section class="card achievements-view">
    <header class="card__header">
      <h2 class="card__title">
        {{ t('achievements.title') }}
      </h2>
      <p class="card__subtitle">
        {{ summarySubtitle }}
      </p>
    </header>

    <div
      class="tabs"
      role="tablist"
    >
      <button
        v-for="tab in groupedAchievements"
        :key="tab.key"
        class="tabs__button"
        :class="{ 'tabs__button--active': tab.key === activeTab }"
        type="button"
        role="tab"
        :aria-selected="tab.key === activeTab"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-if="currentGroup"
      class="achievements-panel"
      role="tabpanel"
      :aria-live="currentGroup ? 'polite' : 'off'"
    >
      <div class="achievements-scroll">
        <div class="grid">
          <article
            v-for="achievement in currentGroup.achievements"
            :key="achievement.id"
            class="achievement"
          >
            <header class="achievement__header">
              <h3 class="achievement__title">
                {{ achievement.name }}
              </h3>
              <span
                class="achievement__status"
                :class="{ 'achievement__status--complete': achievement.unlocked }"
              >
                {{ achievement.unlocked ? t('achievements.status.unlocked') : t('achievements.status.locked') }}
              </span>
            </header>
            <p class="achievement__description">
              {{ achievement.description }}
            </p>
            <div class="progress">
              <div
                class="progress__bar"
                :style="{ width: `${achievement.percent}%` }"
              />
            </div>
            <footer class="achievement__footer">
              <span>{{ formatNumber(achievement.progress) }} / {{ formatNumber(achievement.value) }}</span>
              <span>{{ formatFloat(achievement.percent, 1) }}%</span>
            </footer>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useEconomyStore } from '@/stores/economyStore.js';
import { formatFloat, formatNumber } from '@/utils/formatters.js';
import { useI18nStore } from '@/stores/i18nStore.js';

const economy = useEconomyStore();
const { achievements } = storeToRefs(economy);
const i18n = useI18nStore();
const t = i18n.t;

const achievementsSummary = achievements;

const summarySubtitle = computed(() =>
  t('achievements.subtitle', {
    unlocked: formatNumber(achievementsSummary.value.unlockedCount),
    total: formatNumber(achievementsSummary.value.total),
  }),
);

const groupedAchievements = computed(() => {
  const { list } = achievementsSummary.value;
  const groups = [
    {
      key: 'economy',
      label: t('achievements.tabs.economy'),
      achievements: list.filter((achievement) => achievement.type === 'gold' || achievement.type === 'soul'),
    },
    {
      key: 'combat',
      label: t('achievements.tabs.combat'),
      achievements: list.filter((achievement) => achievement.type === 'slain' || achievement.type === 'herolevel'),
    },
    {
      key: 'prestige',
      label: t('achievements.tabs.prestige'),
      achievements: list.filter((achievement) => achievement.type === 'prestige'),
    },
  ].filter((group) => group.achievements.length > 0);

  const processedUnits = new Set();
  list.forEach((achievement) => {
    if (!achievement.type.startsWith('summon_')) return;
    const unitKey = achievement.type.split('_')[1];
    if (processedUnits.has(unitKey)) return;
    const unitLabel = t('achievements.tabs.summoning', {
      unit: t(`units.${unitKey}.plural`),
    });
    groups.push({
      key: `summon_${unitKey}`,
      label: unitLabel,
      achievements: list.filter((item) => item.type === achievement.type),
    });
    processedUnits.add(unitKey);
  });

  return groups;
});

const activeTab = ref(groupedAchievements.value[0]?.key ?? '');

watch(groupedAchievements, (groups) => {
  if (!groups.length) {
    activeTab.value = '';
    return;
  }
  if (!groups.some((group) => group.key === activeTab.value)) {
    activeTab.value = groups[0].key;
  }
}, { immediate: true });

const currentGroup = computed(() => groupedAchievements.value.find((group) => group.key === activeTab.value));
</script>

<style scoped>
.achievements-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-height: 0;
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

.tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tabs__button {
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(59, 130, 246, 0.35);
  background: rgba(15, 23, 42, 0.5);
  color: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabs__button--active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
}

.achievements-panel {
  flex: 1;
  min-height: 0;
  display: flex;
}

.achievements-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  min-width: 0;
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
