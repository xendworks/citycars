import { ref } from 'vue'

/// <reference path="../types/google-maps.d.ts" />

// Make TypeScript happy with window.google
declare global {
  interface Window {
    google: typeof google;
    [key: string]: any; // To allow dynamic callback property
  }
}

// Basic Google Maps Places API implementation
export function useGoogleMapsPlaces() {
  const isLoaded = ref(false)
  // ⚠️ IMPORTANT: Make sure this API key is valid and Places API is enabled for it
  const API_KEY = 'AIzaSyBeE43b49Ho8n1ULPOoddyS-BMbZH3X3Q8'
  
  // Load Google Maps API directly via script tag
  const loadGoogleMapsApi = () => {
    // Handle SSR case
    if (typeof window === 'undefined') {
      console.warn('Cannot load Google Maps in SSR environment')
      return Promise.resolve(null)
    }
    
    return new Promise((resolve, reject) => {
      // Don't reload if already available
      if (window.google && window.google.maps && window.google.maps.places) {
        isLoaded.value = true
        console.log('Google Maps API already loaded')
        resolve(window.google.maps)
        return
      }
      
      // Simple callback name with timestamp to ensure uniqueness
      const callbackName = 'googleMapsCallback' + Date.now()
      
      // Create the callback function
      window[callbackName] = function() {
        console.log('Google Maps callback triggered')
        isLoaded.value = true
        delete window[callbackName]
        resolve(window.google.maps)
      }
      
      // Create the script element
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=${callbackName}`
      script.async = true
      script.defer = true
      
      // Add error handler
      script.onerror = function(error) {
        console.error('Google Maps script failed to load', error)
        reject(error)
      }
      
      // Add the script to the document
      document.head.appendChild(script)
      
      // Add a timeout as a safety measure
      setTimeout(() => {
        if (!isLoaded.value) {
          console.error('Google Maps API load timed out')
          reject(new Error('Timeout loading Google Maps API'))
        }
      }, 10000)
    })
  }
  
  // Direct method to initialize autocomplete on an input element
  const setupPlacesAutocomplete = (inputElement: HTMLInputElement, options = {}) => {
    if (typeof window === 'undefined' || !inputElement) {
      return null
    }
    
    // Ensure the Google API is loaded
    if (!window.google?.maps?.places?.Autocomplete) {
      console.error('Google Places API not available')
      return null
    }
    
    try {
      console.log(`Creating autocomplete for ${inputElement.id || 'unnamed input'}`)
      
      // Set default options
      const defaultOptions = {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'uk' }
      }
      
      // Create and return the autocomplete instance
      return new window.google.maps.places.Autocomplete(
        inputElement,
        { ...defaultOptions, ...options }
      )
    } catch (error) {
      console.error('Error creating Google Places autocomplete:', error)
      return null
    }
  }
  
  // Method to attach a place changed listener
  const attachPlaceChangedListener = (autocomplete: any, callback: (place: any) => void) => {
    if (typeof window === 'undefined' || !autocomplete || !callback) {
      return
    }
    
    try {
      // Add the place_changed event listener
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        callback(place)
      })
    } catch (error) {
      console.error('Error attaching place_changed listener:', error)
    }
  }
  
  return {
    isLoaded,
    loadGoogleMapsApi,
    setupPlacesAutocomplete,
    attachPlaceChangedListener
  }
} 