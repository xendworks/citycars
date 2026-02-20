// Route protection for Admin portal
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip auth check for login and dev-reset tools
  if (to.path === '/admin/login' || to.path === '/dev-reset') {
    return;
  }

  // Only run on client side
  if (process.client) {
    const { isAuthenticated, isLoading } = useAdminAuth();

    // Wait for initial auth check to complete
    if (isLoading.value) {
      await new Promise<void>((resolve) => {
        const checkLoading = () => {
          if (!isLoading.value) {
            resolve();
            return true;
          }
          return false;
        };
        
        if (!checkLoading()) {
          const timer = setInterval(() => {
            if (checkLoading()) clearInterval(timer);
          }, 50);
          
          // Safety timeout
          setTimeout(() => {
            clearInterval(timer);
            resolve();
          }, 5000);
        }
      });
    }

    if (!isAuthenticated.value) {
      // Redirect to admin login page
      return navigateTo('/admin/login');
    }
  }
});

