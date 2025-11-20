export default defineNuxtRouteMiddleware((to, from) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return;
  }

  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated.value) {
    // Redirect to login page
    return navigateTo('/login');
  }
});

