/**
 * Composable for managing cookie consent
 * Provides utilities to check consent status and manage cookies
 * UK GDPR/PECR compliant
 */
export const useCookieConsent = () => {
  const getCookieConsent = () => {
    if (process.server) return null;
    return (window as any).CookieConsent;
  };

  const hasConsent = (category: 'necessary' | 'analytics' | 'marketing'): boolean => {
    if (process.server) return false;
    
    try {
      const CookieConsent = getCookieConsent();
      if (CookieConsent && typeof CookieConsent.acceptedCategory === 'function') {
        return CookieConsent.acceptedCategory(category);
      }
    } catch (error) {
      console.warn('Error checking cookie consent:', error);
    }
    
    // Default: only necessary cookies are allowed
    return category === 'necessary';
  };

  const hasAnalyticsConsent = (): boolean => {
    return hasConsent('analytics');
  };

  const hasMarketingConsent = (): boolean => {
    return hasConsent('marketing');
  };

  const showPreferences = (): void => {
    if (process.server) return;
    
    try {
      const CookieConsent = getCookieConsent();
      if (CookieConsent && typeof CookieConsent.showPreferences === 'function') {
        CookieConsent.showPreferences();
      }
    } catch (error) {
      console.warn('Error showing cookie preferences:', error);
    }
  };

  const acceptAll = (): void => {
    if (process.server) return;
    
    try {
      const CookieConsent = getCookieConsent();
      if (CookieConsent && typeof CookieConsent.acceptCategory === 'function') {
        CookieConsent.acceptCategory('analytics');
        CookieConsent.acceptCategory('marketing');
      }
    } catch (error) {
      console.warn('Error accepting all cookies:', error);
    }
  };

  const rejectAll = (): void => {
    if (process.server) return;
    
    try {
      const CookieConsent = getCookieConsent();
      if (CookieConsent && typeof CookieConsent.acceptCategory === 'function') {
        CookieConsent.acceptCategory('analytics', false);
        CookieConsent.acceptCategory('marketing', false);
      }
    } catch (error) {
      console.warn('Error rejecting cookies:', error);
    }
  };

  const getConsentData = () => {
    if (process.server) return null;
    
    try {
      const CookieConsent = getCookieConsent();
      if (CookieConsent && typeof CookieConsent.getConsentData === 'function') {
        return CookieConsent.getConsentData();
      }
    } catch (error) {
      console.warn('Error getting consent data:', error);
    }
    
    return null;
  };

  return {
    hasConsent,
    hasAnalyticsConsent,
    hasMarketingConsent,
    showPreferences,
    acceptAll,
    rejectAll,
    getConsentData
  };
};

