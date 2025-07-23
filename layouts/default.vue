<template>
  <div>
    <Navbar />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { useThemeStore } from '@/piniaStore/theme';
import { useQueryStore } from '~/stores/queryStore'

export default {
  components: { Navbar, Footer },
  computed: {
    isDarkTheme() {
      const themeStore = useThemeStore();
      return themeStore.isDarkTheme;
    }
  },
  methods: {
    updateDarkTheme(isDark) {
      const themeStore = useThemeStore();
      themeStore.setIsDarkTheme(isDark);
    }
  }
};
</script>

<style scoped></style>
