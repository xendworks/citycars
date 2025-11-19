export default defineNuxtRouteMiddleware(async (to: any, from: any) => {
  if (process.client) {
    const { initializeAuth } = useAuth();
    await initializeAuth();
  }
});

