import { ref } from 'vue'

export function useDirections() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getDirections({ from, to, departureTime }: { from: { lat: number, lng: number }, to: { lat: number, lng: number }, departureTime?: string }) {
    isLoading.value = true
    error.value = null
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'
      const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json'
      const params = new URLSearchParams({
        origin: `${from.lat},${from.lng}`,
        destination: `${to.lat},${to.lng}`,
        key: apiKey,
        mode: 'driving',
        departure_time: departureTime ? String(Math.floor(new Date(departureTime).getTime() / 1000)) : 'now',
        traffic_model: 'best_guess',
        alternatives: 'false',
        region: 'uk'
      })
      const url = `${baseUrl}?${params.toString()}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0]
        const leg = route.legs[0]
        return {
          distance: leg.distance.text,
          duration: leg.duration.text,
          duration_in_traffic: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
          start_address: leg.start_address,
          end_address: leg.end_address,
          polyline: route.overview_polyline.points,
          traffic: leg.duration_in_traffic ? true : false
        }
      } else {
        throw new Error(data.error_message || 'No route found')
      }
    } catch (e: unknown) {
      if (typeof e === 'object' && e && 'message' in e) {
        // @ts-ignore
        error.value = (e as any).message
      } else {
        error.value = String(e)
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { getDirections, isLoading, error }
} 