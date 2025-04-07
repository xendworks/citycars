// This plugin loads the Google Maps API on the client side
export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (typeof window === 'undefined') return
  
  console.log('Google Maps plugin initialized')
  
  // Create a promise to track Google Maps API loading
  const googleMapsPromise = new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('Google Maps already loaded')
      resolve(window.google.maps)
      return
    }
    
    // API Key - Make sure this key has Places API enabled
    const API_KEY = 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'
    
    // Create a callback function
    const callbackName = 'googleMapsInitialized_' + Date.now()
    window[callbackName] = function() {
      console.log('Google Maps loaded via plugin')
      // Clean up the callback
      if (window[callbackName]) delete window[callbackName]
      
      // Check if places library is available
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve(window.google.maps)
      } else {
        reject(new Error('Google Maps Places API not available'))
      }
    }
    
    // Create script element
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=${callbackName}`
    script.async = true
    script.defer = true
    
    // Handle script loading errors
    script.onerror = function(error) {
      console.error('Error loading Google Maps script:', error)
      reject(new Error('Failed to load Google Maps script'))
    }
    
    // Add script to document
    document.head.appendChild(script)
  })
  
  // Provide the Google Maps promise to components
  return {
    provide: {
      googleMaps: () => googleMapsPromise
    }
  }
}) 