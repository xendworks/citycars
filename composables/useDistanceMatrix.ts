import { ref } from 'vue'

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        DistanceMatrixService: new () => google.maps.DistanceMatrixService;
        TravelMode: {
          DRIVING: google.maps.TravelMode;
        };
        UnitSystem: {
          IMPERIAL: google.maps.UnitSystem;
        };
      };
    };
  }
}

// Define the response interface since it's not properly exposed in the type definitions
interface DistanceMatrixResponse {
  rows: {
    elements: {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }[];
  }[];
  originAddresses: string[];
  destinationAddresses: string[];
}

// Type definitions for the distance matrix results
interface DistanceMatrixResult {
  distance: {
    text: string;
    value: number; // meters
  };
  duration: {
    text: string;
    value: number; // seconds
  };
  status: string;
}

interface RouteDetails {
  distance: string;
  duration: string;
  distanceValue: number; // meters
  durationValue: number; // seconds
  eta?: string;
}

export function useDistanceMatrix() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const routeDetails = ref<RouteDetails | null>(null)

  // Calculate distance between two points
  const calculateDistance = async (origin: string, destination: string): Promise<RouteDetails | null> => {
    // Handle SSR case
    if (typeof window === 'undefined') {
      console.warn('Cannot use Google Maps in SSR environment')
      return null
    }

    // Check if Google Maps is loaded
    if (!window.google?.maps?.DistanceMatrixService) {
      error.value = 'Google Maps API not loaded or Distance Matrix service not available'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const service = new window.google.maps.DistanceMatrixService()
      
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL, // Use miles
            avoidHighways: false,
            avoidTolls: false,
          },
          (response, status) => {
            if (status !== 'OK') {
              reject(new Error(`Distance matrix failed: ${status}`))
              return
            }
            resolve(response)
          }
        )
      })

      // Parse the response
      if (response.rows[0].elements[0].status === 'OK') {
        const element = response.rows[0].elements[0]
        
        routeDetails.value = {
          distance: element.distance!.text,
          duration: element.duration!.text,
          distanceValue: element.distance!.value,
          durationValue: element.duration!.value
        }
        
        return routeDetails.value
      } else {
        error.value = `Route calculation failed: ${response.rows[0].elements[0].status}`
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error calculating distance'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Calculate ETA based on departure time and duration
  const calculateETA = (departureTime: Date, durationInSeconds: number): string => {
    const arrivalTime = new Date(departureTime.getTime() + durationInSeconds * 1000)
    return arrivalTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return {
    isLoading,
    error,
    routeDetails,
    calculateDistance,
    calculateETA
  }
} 