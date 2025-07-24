export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return;

  // Replace with your actual Google Analytics Measurement ID
  const GA_MEASUREMENT_ID = 'G-4QFM4RFRRM';

  // Inject the Google Analytics script
  if (!window.GA_INITIALIZED) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    window.GA_INITIALIZED = true;
  }

  // Optionally, track route changes
  nuxtApp.hook('page:finish', () => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  });
}); 