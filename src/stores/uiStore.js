import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const activeTab = ref('battle');
  const resetModalOpen = ref(false);

  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };

  const openResetModal = () => {
    resetModalOpen.value = true;
  };

  const closeResetModal = () => {
    resetModalOpen.value = false;
  };

  return {
    activeTab,
    resetModalOpen,
    setActiveTab,
    openResetModal,
    closeResetModal,
  };
});
