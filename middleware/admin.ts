export default defineNuxtRouteMiddleware((to, from) => {
  // Skip auth check for login page
  if (to.path === '/admin/login') {
    return;
  }

  // Only run on client side
  if (process.client) {
    const { isAuthenticated } = useAdminAuth();

    if (!isAuthenticated.value) {
      // Redirect to admin login page
      return navigateTo('/admin/login');
    }
  }
});

