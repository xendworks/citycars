// Types for Google Maps Places
interface Place {
  place_id: string
  formatted_address: string
  name: string
  geometry: {
    location: {
      lat(): number
      lng(): number
    }
  }
}

interface PlacesAutocomplete {
  addListener(event: string, callback: () => void): void
  getPlace(): Place | null
}

export function useGoogleMapsPlaces() {
  const isLoaded = ref(false)
  const { $googleMaps } = useNuxtApp()

  // Load Google Maps API
  const loadGoogleMapsApi = async (): Promise<any | null> => {
    try {
      if (!$googleMaps) {
        console.error('Google Maps plugin not available')
        return null
      }
      
      const maps = await ($googleMaps as any)()
      isLoaded.value = true
      return maps
    } catch (error) {
      console.error('Failed to load Google Maps API:', error)
      return null
    }
  }

  // Setup Places Autocomplete on an input element
  const setupPlacesAutocomplete = async (inputElement: HTMLInputElement): Promise<PlacesAutocomplete | null> => {
    try {
      const maps = await loadGoogleMapsApi()
      if (!maps || !maps.places) {
        console.error('Google Maps Places API not available')
        return null
      }

      // Create autocomplete instance
      const autocomplete = new maps.places.Autocomplete(inputElement, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'gb' }, // Restrict to UK
        fields: ['place_id', 'formatted_address', 'name', 'geometry']
      })

      return autocomplete as PlacesAutocomplete
    } catch (error) {
      console.error('Failed to setup Places Autocomplete:', error)
      return null
    }
  }

  // Attach place changed listener to autocomplete
  const attachPlaceChangedListener = (
    autocomplete: PlacesAutocomplete,
    callback: (place: Place | null) => void
  ): void => {
    if (!autocomplete) return

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      callback(place)
    })
  }

  return {
    isLoaded: readonly(isLoaded),
    loadGoogleMapsApi,
    setupPlacesAutocomplete,
    attachPlaceChangedListener
  }
} 