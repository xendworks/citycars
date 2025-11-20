/**
 * CITY CARS PRICING CONFIGURATION
 * ==================================
 * Easily configurable pricing rules for all vehicle types
 */

// Base pricing tiers for SALOON vehicles
export const PRICING_CONFIG = {
  // Price per mile for different distance ranges
  tiers: [
    {
      name: 'Short Distance',
      minMiles: 1,
      maxMiles: 5,
      pricePerMile: 5.00,
      minimumFare: 25.00,
      description: '1-5 miles @ £5 per mile (£25 minimum)'
    },
    {
      name: 'Medium Distance',
      minMiles: 6,
      maxMiles: 10,
      pricePerMile: 3.00,
      baseFare: 25.00, // Base from tier 1
      description: '6-10 miles @ Base + £3 per additional mile'
    },
    {
      name: 'Long Distance',
      minMiles: 11,
      maxMiles: 30,
      pricePerMile: 2.00,
      baseFare: 40.00, // Base from tiers 1 + 2 (£25 + 5*£3)
      description: '11-30 miles @ Base + £2 per additional mile'
    },
    {
      name: 'Extra Long Distance',
      minMiles: 31,
      maxMiles: Infinity,
      pricePerMile: 1.50,
      baseFare: 65.00, // Base from tiers 1 + 2 + 3 (£25 + 5*£3 + 20*£2)
      description: '30+ miles @ Base + £1.50 per additional mile'
    }
  ],

  // Vehicle type multipliers (percentage increase over base saloon price)
  // INCREMENTAL: Each level is 15% MORE than the previous
  vehicleMultipliers: {
    saloon: 0,       // 0% extra (base price)
    estate: 15,      // 15% extra
    mpv: 30,         // 30% extra (15% more than estate)
    '7seater': 45,   // 45% extra (15% more than mpv)
    '9seater': 60,   // 60% extra (15% more than 7 seater)
    wheelchair: 15   // 15% extra
  },

  // Extra charges (optional add-ons)
  extras: {
    meetAndGreet: 10.00,
    childSeat: 5.00,
    airportPickup: 0.00, // No extra charge currently
    nightSurcharge: 0.00 // No extra charge currently
  },

  // Payment method surcharges (percentage)
  paymentSurcharges: {
    cash: 0,        // 0% admin charges
    card: 3,        // 3% admin charges
    paypal: 5       // 5% admin charges
  }
};

/**
 * Calculate fare based on distance for SALOON vehicle
 * @param miles - Distance in miles
 * @returns Calculated fare for saloon vehicle
 */
export function calculateSaloonFare(miles: number): number {
  if (miles <= 0) return 0;

  // Find the appropriate tier
  const tier = PRICING_CONFIG.tiers.find(
    t => miles >= t.minMiles && miles <= t.maxMiles
  );

  if (!tier) {
    console.error('No pricing tier found for distance:', miles);
    return 0;
  }

  // Calculate fare based on tier
  if (tier.minimumFare !== undefined) {
    // Tier 1: Simple per-mile with minimum
    const calculatedFare = miles * tier.pricePerMile;
    return Math.max(calculatedFare, tier.minimumFare);
  } else if (tier.baseFare !== undefined) {
    // Tiers 2-4: Base fare + additional miles at tier rate
    const additionalMiles = miles - tier.minMiles + 1;
    return tier.baseFare + (additionalMiles * tier.pricePerMile);
  }

  return 0;
}

/**
 * Calculate fare for any vehicle type
 * @param miles - Distance in miles
 * @param vehicleType - Type of vehicle
 * @returns Calculated fare with vehicle type multiplier
 */
export function calculateFare(
  miles: number,
  vehicleType: 'saloon' | 'estate' | 'mpv' | '7seater' | '9seater' | 'wheelchair' = 'saloon'
): number {
  // Calculate base saloon fare
  const saloonFare = calculateSaloonFare(miles);

  // Apply vehicle type multiplier
  const multiplier = PRICING_CONFIG.vehicleMultipliers[vehicleType as keyof typeof PRICING_CONFIG.vehicleMultipliers] || 0;
  const vehicleSurcharge = (saloonFare * multiplier) / 100;

  const totalFare = saloonFare + vehicleSurcharge;

  console.log('💰 FARE CALCULATION:', {
    distance: `${miles.toFixed(2)} miles`,
    vehicleType,
    saloonBaseFare: `£${saloonFare.toFixed(2)}`,
    vehicleSurcharge: `${multiplier}% = £${vehicleSurcharge.toFixed(2)}`,
    totalFare: `£${totalFare.toFixed(2)}`
  });

  return Math.round(totalFare * 100) / 100; // Round to 2 decimal places
}

/**
 * Get fare breakdown with detailed pricing information
 * @param miles - Distance in miles
 * @param vehicleType - Type of vehicle
 * @param extras - Optional extras
 * @returns Detailed fare breakdown
 */
export function getFareBreakdown(
  miles: number,
  vehicleType: 'saloon' | 'estate' | 'mpv' | '7seater' | '9seater' | 'wheelchair' = 'saloon',
  extras: {
    meetAndGreet?: boolean;
    childSeat?: boolean;
    paymentMethod?: 'cash' | 'card' | 'paypal';
  } = {}
) {
  const baseFare = calculateFare(miles, vehicleType);
  
  // Calculate extras
  let extrasCost = 0;
  const extrasBreakdown: string[] = [];
  
  if (extras.meetAndGreet) {
    extrasCost += PRICING_CONFIG.extras.meetAndGreet;
    extrasBreakdown.push(`Meet & Greet: £${PRICING_CONFIG.extras.meetAndGreet.toFixed(2)}`);
  }
  
  if (extras.childSeat) {
    extrasCost += PRICING_CONFIG.extras.childSeat;
    extrasBreakdown.push(`Child Seat: £${PRICING_CONFIG.extras.childSeat.toFixed(2)}`);
  }

  const subtotal = baseFare + extrasCost;

  // Calculate payment surcharge
  let paymentSurcharge = 0;
  if (extras.paymentMethod && extras.paymentMethod !== 'cash') {
    const surchargePercent = PRICING_CONFIG.paymentSurcharges[extras.paymentMethod];
    paymentSurcharge = (subtotal * surchargePercent) / 100;
  }

  const totalFare = subtotal + paymentSurcharge;

  return {
    baseFare,
    extrasCost,
    extrasBreakdown,
    subtotal,
    paymentSurcharge,
    paymentSurchargePercent: extras.paymentMethod ? PRICING_CONFIG.paymentSurcharges[extras.paymentMethod] : 0,
    totalFare,
    breakdown: {
      distance: `${miles.toFixed(2)} miles`,
      vehicleType,
      baseFare: `£${baseFare.toFixed(2)}`,
      extras: extrasBreakdown.join(', ') || 'None',
      paymentMethod: extras.paymentMethod || 'cash',
      total: `£${totalFare.toFixed(2)}`
    }
  };
}

/**
 * Get pricing tier information for a given distance
 * @param miles - Distance in miles
 * @returns Pricing tier information
 */
export function getPricingTier(miles: number) {
  return PRICING_CONFIG.tiers.find(
    t => miles >= t.minMiles && miles <= t.maxMiles
  );
}

/**
 * Calculate estimated fare for display (before exact distance is known)
 * @param estimatedMiles - Estimated distance
 * @param vehicleType - Type of vehicle
 * @returns Estimated fare
 */
export function estimateFare(
  estimatedMiles: number,
  vehicleType: 'saloon' | 'estate' | 'mpv' | '7seater' | '9seater' | 'wheelchair' = 'saloon'
): { min: number; max: number; average: number } {
  const exactFare = calculateFare(estimatedMiles, vehicleType);
  
  // Add ±10% margin for estimation
  const min = Math.round((exactFare * 0.9) * 100) / 100;
  const max = Math.round((exactFare * 1.1) * 100) / 100;
  const average = exactFare;

  return { min, max, average };
}

/**
 * Export pricing config for display in admin/settings
 */
export function getPricingConfig() {
  return PRICING_CONFIG;
}

