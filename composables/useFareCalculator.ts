import { ref, computed } from 'vue'

// Types
interface Location {
  name: string
  lat: number
  lng: number
}

interface FareRequest {
  from: Location
  to: Location
  vehicleType: 'saloon' | 'estate' | 'mpv' | 'wheelchair'
  passengers: number
  luggage: number
  pickupDateTime: string
}

interface FareResponse {
  baseFare: number
  distanceMiles: number
  durationMinutes: number
  peakHourSurcharge: number
  trafficSurcharge: number
  vehicleSurcharge: number
  totalFare: number
  breakdown: {
    baseRate: number
    distanceCost: number
    timeCost: number
    peakHourCost: number
    trafficCost: number
    vehicleTypeCost: number
  }
}

const VEHICLE_SURCHARGES = {
  saloon: 0.20,    // 20%
  estate: 0.35,    // 35%
  mpv: 0.40,       // 40%
  wheelchair: 0.45  // 45%
}

// Peak hour definitions (UK time)
const PEAK_HOURS = {
  morning: { start: 7, end: 9 },    // 7 AM - 9 AM
  evening: { start: 17, end: 19 },  // 5 PM - 7 PM
  weekend: { start: 10, end: 18 }   // 10 AM - 6 PM (weekends)
}

const PEAK_SURCHARGES = {
  morning: 0.25,    // 25% surcharge
  evening: 0.30,    // 30% surcharge
  weekend: 0.15     // 15% surcharge
}

// Pricing rules based on distance
const PRICING_RULES = [
  { minMiles: 1, maxMiles: 5, pricePerMile: 5.00, minimumFare: 25.00 },
  { minMiles: 6, maxMiles: 10, pricePerMile: 3.00, minimumFare: null },
  { minMiles: 11, maxMiles: 30, pricePerMile: 2.00, minimumFare: null },
  { minMiles: 31, maxMiles: null, pricePerMile: 1.50, minimumFare: null }
]

// Helper function to get pricing rule based on distance
const getPricingRule = (distanceMiles: number) => {
  for (const rule of PRICING_RULES) {
    if (distanceMiles >= rule.minMiles && 
        (rule.maxMiles === null || distanceMiles <= rule.maxMiles)) {
      return rule
    }
  }
  // Fallback to last rule (longest distance)
  return PRICING_RULES[PRICING_RULES.length - 1]
}

export const useFareCalculator = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (from: Location, to: Location): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = (to.lat - from.lat) * Math.PI / 180
    const dLng = (to.lng - from.lng) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Check if current time is peak hour
  const isPeakHour = (dateTime: string): { isPeak: boolean; type: string | null; surcharge: number } => {
    const date = new Date(dateTime)
    const hour = date.getHours()
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday

    // Weekend peak hours
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (hour >= PEAK_HOURS.weekend.start && hour <= PEAK_HOURS.weekend.end) {
        return { isPeak: true, type: 'weekend', surcharge: PEAK_SURCHARGES.weekend }
      }
    }
    // Weekday peak hours
    else {
      if (hour >= PEAK_HOURS.morning.start && hour <= PEAK_HOURS.morning.end) {
        return { isPeak: true, type: 'morning', surcharge: PEAK_SURCHARGES.morning }
      }
      if (hour >= PEAK_HOURS.evening.start && hour <= PEAK_HOURS.evening.end) {
        return { isPeak: true, type: 'evening', surcharge: PEAK_SURCHARGES.evening }
      }
    }

    return { isPeak: false, type: null, surcharge: 0 }
  }

  // Simulate traffic conditions based on time and route
  const getTrafficMultiplier = (dateTime: string, distance: number): number => {
    const date = new Date(dateTime)
    const hour = date.getHours()
    const dayOfWeek = date.getDay()

    // Base traffic multiplier
    let multiplier = 1.0

    // Rush hour traffic
    if (hour >= 7 && hour <= 9) multiplier += 0.3
    if (hour >= 17 && hour <= 19) multiplier += 0.4

    // Weekend traffic (lighter)
    if (dayOfWeek === 0 || dayOfWeek === 6) multiplier -= 0.2

    // Distance-based traffic (longer routes have more traffic variability)
    if (distance > 50) multiplier += 0.1
    if (distance > 100) multiplier += 0.2

    return Math.max(1.0, multiplier)
  }

  // Get real-time traffic data (simulated)
  const getTrafficData = async (from: Location, to: Location): Promise<{ duration: number; trafficLevel: string }> => {
    // In a real implementation, this would call Google Maps API or similar
    const distance = calculateDistance(from, to)
    const baseDuration = distance * 2.5 // 2.5 minutes per mile average
    
    // Simulate traffic conditions
    const trafficMultiplier = getTrafficMultiplier(new Date().toISOString(), distance)
    const duration = baseDuration * trafficMultiplier

    let trafficLevel = 'normal'
    if (trafficMultiplier > 1.5) trafficLevel = 'heavy'
    else if (trafficMultiplier > 1.2) trafficLevel = 'moderate'

    return { duration, trafficLevel }
  }

  // Calculate fare based on all factors
  const calculateFare = async (request: FareRequest): Promise<FareResponse | null> => {
    isLoading.value = true
    error.value = null

    try {
      // Calculate base distance
      const distanceMiles = calculateDistance(request.from, request.to)

      // Get traffic data
      const trafficData = await getTrafficData(request.from, request.to)
      const durationMinutes = trafficData.duration

      // Get pricing rule based on distance
      const pricingRule = getPricingRule(distanceMiles)
      
      // Calculate base fare using the pricing rule
      let baseFare = distanceMiles * pricingRule.pricePerMile
      
      // Apply minimum fare if applicable
      if (pricingRule.minimumFare && baseFare < pricingRule.minimumFare) {
        baseFare = pricingRule.minimumFare
      }

      // Calculate peak hour surcharge
      const peakHourData = isPeakHour(request.pickupDateTime)
      const peakHourSurcharge = baseFare * peakHourData.surcharge

      // Calculate traffic surcharge
      const trafficSurcharge = baseFare * (getTrafficMultiplier(request.pickupDateTime, distanceMiles) - 1)

      // Calculate vehicle type surcharge
      const vehicleSurcharge = baseFare * VEHICLE_SURCHARGES[request.vehicleType]

      // Calculate total fare
      const totalFare = baseFare + peakHourSurcharge + trafficSurcharge + vehicleSurcharge

      // Breakdown for transparency
      const breakdown = {
        baseRate: pricingRule.pricePerMile,
        distanceCost: distanceMiles * pricingRule.pricePerMile,
        timeCost: 0, // No time-based cost in new pricing
        peakHourCost: peakHourSurcharge,
        trafficCost: trafficSurcharge,
        vehicleTypeCost: vehicleSurcharge
      }

      return {
        baseFare,
        distanceMiles,
        durationMinutes,
        peakHourSurcharge,
        trafficSurcharge,
        vehicleSurcharge,
        totalFare,
        breakdown
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

  // Format fare for display
  const formatFare = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  // Get vehicle type display name
  const getVehicleDisplayName = (type: string): string => {
    const names = {
      saloon: 'Saloon Car',
      estate: 'Estate Car',
      mpv: 'MPV',
      wheelchair: 'Wheelchair Accessible'
    }
    return names[type as keyof typeof names] || type
  }

  // Get peak hour display name
  const getPeakHourDisplayName = (type: string | null): string => {
    const names = {
      morning: 'Morning Rush Hour',
      evening: 'Evening Rush Hour',
      weekend: 'Weekend Peak'
    }
    return names[type as keyof typeof names] || 'Standard Hours'
  }

  return {
    calculateFare,
    formatFare,
    getVehicleDisplayName,
    getPeakHourDisplayName,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    VEHICLE_SURCHARGES,
    PEAK_SURCHARGES,
    PRICING_RULES
  }
} 