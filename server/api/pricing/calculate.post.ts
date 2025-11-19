import { collections } from '~/server/utils/db';

interface PricingRequest {
  distanceMiles: number;
  vehicleType?: 'saloon' | 'estate' | 'mpv' | 'wheelchair';
  pickupDateTime?: string;
}

interface PricingRule {
  minMiles: number;
  maxMiles: number | null;
  pricePerMile: number;
  minimumFare: number | null;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<PricingRequest>(event);
    const { distanceMiles, vehicleType = 'saloon', pickupDateTime } = body;

    if (!distanceMiles || distanceMiles <= 0) {
      throw createError({
        statusCode: 400,
        message: 'Distance in miles is required and must be greater than 0'
      });
    }

    // Get active pricing rules from Firestore
    const rulesSnapshot = await collections.pricingRules()
      .where('isActive', '==', true)
      .orderBy('minMiles', 'asc')
      .get();

    const rules: PricingRule[] = rulesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        minMiles: data.minMiles,
        maxMiles: data.maxMiles,
        pricePerMile: data.pricePerMile,
        minimumFare: data.minimumFare
      };
    });

    // If no rules in Firestore, use hardcoded defaults
    if (rules.length === 0) {
      rules.push(
        { minMiles: 1, maxMiles: 5, pricePerMile: 5.00, minimumFare: 25.00 },
        { minMiles: 6, maxMiles: 10, pricePerMile: 3.00, minimumFare: null },
        { minMiles: 11, maxMiles: 30, pricePerMile: 2.00, minimumFare: null },
        { minMiles: 31, maxMiles: null, pricePerMile: 1.50, minimumFare: null }
      );
    }

    // Find the applicable pricing rule
    let applicableRule: PricingRule | null = null;
    for (const rule of rules) {
      if (distanceMiles >= rule.minMiles && 
          (rule.maxMiles === null || distanceMiles <= rule.maxMiles)) {
        applicableRule = rule;
        break;
      }
    }

    if (!applicableRule) {
      // Use the last rule (highest tier) if distance exceeds all ranges
      applicableRule = rules[rules.length - 1];
    }

    // Calculate base fare
    let baseFare = distanceMiles * applicableRule.pricePerMile;
    
    // Apply minimum fare if applicable
    if (applicableRule.minimumFare && baseFare < applicableRule.minimumFare) {
      baseFare = applicableRule.minimumFare;
    }

    // Vehicle type surcharges (same as frontend)
    const vehicleSurcharges: Record<string, number> = {
      saloon: 0.20,    // 20%
      estate: 0.35,    // 35%
      mpv: 0.40,       // 40%
      wheelchair: 0.45  // 45%
    };

    const vehicleSurcharge = baseFare * (vehicleSurcharges[vehicleType] || 0);

    // Peak hour calculation
    let peakHourSurcharge = 0;
    if (pickupDateTime) {
      const date = new Date(pickupDateTime);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend peak: 10 AM - 6 PM, 15% surcharge
        if (hour >= 10 && hour <= 18) {
          peakHourSurcharge = baseFare * 0.15;
        }
      } else {
        // Weekday peak hours
        if (hour >= 7 && hour <= 9) {
          peakHourSurcharge = baseFare * 0.25; // Morning rush
        } else if (hour >= 17 && hour <= 19) {
          peakHourSurcharge = baseFare * 0.30; // Evening rush
        }
      }
    }

    // Traffic surcharge (simplified)
    let trafficSurcharge = 0;
    if (pickupDateTime) {
      const date = new Date(pickupDateTime);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      
      let trafficMultiplier = 1.0;
      if (hour >= 7 && hour <= 9) trafficMultiplier += 0.3;
      if (hour >= 17 && hour <= 19) trafficMultiplier += 0.4;
      if (dayOfWeek === 0 || dayOfWeek === 6) trafficMultiplier -= 0.2;
      if (distanceMiles > 50) trafficMultiplier += 0.1;
      if (distanceMiles > 100) trafficMultiplier += 0.2;
      
      trafficSurcharge = baseFare * Math.max(0, trafficMultiplier - 1.0);
    }

    const totalFare = baseFare + peakHourSurcharge + trafficSurcharge + vehicleSurcharge;

    return {
      success: true,
      data: {
        distanceMiles: parseFloat(distanceMiles.toFixed(2)),
        baseFare: parseFloat(baseFare.toFixed(2)),
        peakHourSurcharge: parseFloat(peakHourSurcharge.toFixed(2)),
        trafficSurcharge: parseFloat(trafficSurcharge.toFixed(2)),
        vehicleSurcharge: parseFloat(vehicleSurcharge.toFixed(2)),
        totalFare: parseFloat(totalFare.toFixed(2)),
        pricingRule: {
          minMiles: applicableRule.minMiles,
          maxMiles: applicableRule.maxMiles,
          pricePerMile: parseFloat(applicableRule.pricePerMile.toFixed(2)),
          minimumFare: applicableRule.minimumFare ? parseFloat(applicableRule.minimumFare.toFixed(2)) : null
        },
        breakdown: {
          distanceCost: parseFloat((distanceMiles * applicableRule.pricePerMile).toFixed(2)),
          peakHourCost: parseFloat(peakHourSurcharge.toFixed(2)),
          trafficCost: parseFloat(trafficSurcharge.toFixed(2)),
          vehicleTypeCost: parseFloat(vehicleSurcharge.toFixed(2))
        }
      }
    };
  } catch (error: any) {
    console.error('Pricing calculation error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to calculate pricing'
    });
  }
});
