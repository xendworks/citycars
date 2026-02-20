import { useLocalStorage } from '@vueuse/core';
import { watch, onMounted } from 'vue';

export const useAdminDarkMode = () => {
  const isDarkMode = useLocalStorage('citycars-admin-dark-mode', false);

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  // Apply to document element for global utilities and Element Plus
  watch(isDarkMode, (val) => {
    if (process.client) {
      if (val) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, { immediate: true });

  return {
    isDarkMode,
    toggleDarkMode
  };
};
