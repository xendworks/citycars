import { ref } from 'vue'

export function useGeocode() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function geocodeAddress(address: string) {
    isLoading.value = true
    error.value = null
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyACZ4JkEhZZAhafla2ePLtmNL7ktaxV8KM'
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:GB&key=${apiKey}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        return { lat, lng, formatted_address: data.results[0].formatted_address }
      } else {
        throw new Error(data.error_message || 'No results found')
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

  return { geocodeAddress, isLoading, error }
} 