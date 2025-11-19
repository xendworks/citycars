// This plugin loads the Google Maps API on the client side with optimizations
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (typeof window === 'undefined') return
  
  console.log('Google Maps plugin initialized')
  
  // Track loading state
  let isLoading = false
  let isLoaded = false
  let loadPromise = null
  
  const loadGoogleMaps = () => {
    if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve(window.google.maps)
    }
    
    // If already loading, return existing promise
    if (isLoading && loadPromise) {
      console.log('Google Maps already loading, returning existing promise')
      return loadPromise
    }
    
    isLoading = true
    
    loadPromise = new Promise((resolve, reject) => {
      // API Key - Make sure this key has Places API enabled
      const API_KEY = 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'
      
      // Create a callback function
      const callbackName = 'googleMapsInitialized_' + Date.now()
      window[callbackName] = function() {
        console.log('Google Maps loaded via plugin')
        isLoaded = true
        isLoading = false
        
        // Clean up the callback
        if (window[callbackName]) delete window[callbackName]
        
        // Check if places library is available
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve(window.google.maps)
        } else {
          reject(new Error('Google Maps Places API not available'))
        }
      }
      
      // Create script element with optimizations
      // Include region=gb to bias results towards UK
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry&callback=${callbackName}&v=weekly&region=gb`
      script.async = true
      script.defer = true
      
      // Add preload hint for faster loading
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'script'
      preloadLink.href = script.src
      document.head.appendChild(preloadLink)
      
      // Handle script loading errors
      script.onerror = function(error) {
        console.error('Error loading Google Maps script:', error)
        isLoading = false
        reject(new Error('Failed to load Google Maps script'))
      }
      
      // Add script to document
      document.head.appendChild(script)
      
      // Timeout after 15 seconds
      setTimeout(() => {
        if (isLoading) {
          isLoading = false
          reject(new Error('Google Maps loading timeout'))
        }
      }, 15000)
    })
    
    return loadPromise
  }
  
  // Preload Google Maps when page loads
  if (process.client) {
    // Start loading immediately but don't block
    setTimeout(() => {
      loadGoogleMaps().catch(err => {
        console.warn('Preload Google Maps failed:', err)
      })
    }, 100)
  }
  
  // Provide the Google Maps promise to components
  return {
    provide: {
      googleMaps: loadGoogleMaps,
      googleMapsLoading: () => isLoading,
      googleMapsLoaded: () => isLoaded
    }
  }
}) 