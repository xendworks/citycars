export default defineNuxtPlugin(async () => {
  if (process.client) {
    const { initializeAuth } = useAuth();
    await initializeAuth();
  }
});


