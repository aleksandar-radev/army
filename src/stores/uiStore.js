import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const activeTab = ref('battle');
  const resetModalOpen = ref(false);
  const mobileMenuOpen = ref(false);

  const setActiveTab = (tab) => {
    activeTab.value = tab;
    mobileMenuOpen.value = false;
  };

  const openResetModal = () => {
    resetModalOpen.value = true;
  };

  const closeResetModal = () => {
    resetModalOpen.value = false;
  };

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };

  return {
    activeTab,
    resetModalOpen,
    mobileMenuOpen,
    setActiveTab,
    openResetModal,
    closeResetModal,
    toggleMobileMenu,
    closeMobileMenu,
  };
});
