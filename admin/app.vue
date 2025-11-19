<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize Firebase on app mount
onMounted(() => {
  console.log('🔥 CityCars Admin Portal initialized');
});
</script>

