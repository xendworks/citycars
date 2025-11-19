# 💰 CITY CARS PRICING GUIDE

## Quick Start: How to Change Prices

All pricing is configured in ONE file: **`/utils/pricing.ts`**

Just edit this file and save - prices update instantly! 🔥

---

## 🎯 Current Pricing Structure

### **Base Pricing (Saloon Cars)**

```typescript
// 1-5 miles @ £5 per mile (£25 minimum)
{
  minMiles: 1,
  maxMiles: 5,
  pricePerMile: 5.00,
  minimumFare: 25.00
}

// 6-10 miles @ £25 + £3 per additional mile
{
  minMiles: 6,
  maxMiles: 10,
  pricePerMile: 3.00,
  baseFare: 25.00
}

// 11-30 miles @ £40 + £2 per additional mile
{
  minMiles: 11,
  maxMiles: 30,
  pricePerMile: 2.00,
  baseFare: 40.00  // (£25 + 5*£3)
}

// 30+ miles @ £65 + £1.50 per additional mile
{
  minMiles: 31,
  maxMiles: Infinity,
  pricePerMile: 1.50,
  baseFare: 65.00  // (£25 + 5*£3 + 20*£2)
}
```

### **Vehicle Multipliers**

```typescript
{
  saloon: 0,       // Base price (no extra)
  estate: 15,      // +15% extra
  mpv: 15,         // +15% extra
  wheelchair: 15   // +15% extra
}
```

---

## 📝 Examples

### Example 1: 3 Mile Journey (Saloon)
- Distance: 3 miles
- Tier: 1-5 miles
- Calculation: 3 × £5 = **£15**
- But minimum is £25, so **Final: £25**

### Example 2: 8 Mile Journey (Saloon)
- Distance: 8 miles
- Tier: 6-10 miles
- Base: £25
- Additional: (8-6+1) × £3 = 3 × £3 = £9
- **Final: £34**

### Example 3: 15 Mile Journey (Estate)
- Distance: 15 miles (Estate)
- Tier: 11-30 miles
- Base: £40
- Additional: (15-11+1) × £2 = 5 × £2 = £10
- Saloon fare: £50
- Estate multiplier: +15%
- **Final: £50 + (£50 × 0.15) = £57.50**

### Example 4: 40 Mile Journey (MPV)
- Distance: 40 miles (MPV)
- Tier: 30+ miles
- Base: £65
- Additional: (40-31+1) × £1.50 = 10 × £1.50 = £15
- Saloon fare: £80
- MPV multiplier: +15%
- **Final: £80 + (£80 × 0.15) = £92**

---

## 🔧 How to Change Prices

### 1. Change Per-Mile Rates

Open `/utils/pricing.ts` and edit the `tiers` array:

```typescript
// TO INCREASE 6-10 MILE RATE FROM £3 TO £4:
{
  name: 'Medium Distance',
  minMiles: 6,
  maxMiles: 10,
  pricePerMile: 4.00,  // ← CHANGE THIS
  baseFare: 25.00,
  description: '6-10 miles @ Base + £4 per additional mile'
}
```

### 2. Change Vehicle Multipliers

```typescript
// TO INCREASE ESTATE SURCHARGE FROM 15% TO 20%:
vehicleMultipliers: {
  saloon: 0,
  estate: 20,  // ← CHANGE THIS
  mpv: 15,
  wheelchair: 15
}
```

### 3. Change Minimum Fare

```typescript
// TO INCREASE MINIMUM FARE FROM £25 TO £30:
{
  name: 'Short Distance',
  minMiles: 1,
  maxMiles: 5,
  pricePerMile: 5.00,
  minimumFare: 30.00,  // ← CHANGE THIS
  description: '1-5 miles @ £5 per mile (£30 minimum)'
}
```

### 4. Add Extra Charges

```typescript
// TO CHANGE MEET & GREET FROM £10 TO £15:
extras: {
  meetAndGreet: 15.00,  // ← CHANGE THIS
  childSeat: 5.00,
  airportPickup: 0.00,
  nightSurcharge: 0.00
}
```

---

## 🚀 Testing Price Changes

1. Edit `/utils/pricing.ts`
2. Save the file
3. Go to the quote page: http://localhost:3000/quote
4. Search for a ride
5. See updated prices!

**The browser console will show:**
```
💰 FARE CALCULATION:
  distance: "15.00 miles"
  vehicleType: "estate"
  saloonBaseFare: "£50.00"
  vehicleSurcharge: "15% = £7.50"
  totalFare: "£57.50"
```

---

## 🎨 Advanced: Custom Pricing Logic

Want completely custom logic? Edit the `calculateSaloonFare` function:

```typescript
export function calculateSaloonFare(miles: number): number {
  if (miles <= 0) return 0;

  // YOUR CUSTOM LOGIC HERE
  // Example: Flat rate for all distances
  return 50.00;

  // Example: Simple linear pricing
  return miles * 3.50;

  // Example: Weekend surcharge
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const baseFare = miles * 3.00;
  return isWeekend ? baseFare * 1.2 : baseFare;
}
```

---

## 📊 Price Calculator Functions

The utility exports these helpful functions:

### `calculateFare(miles, vehicleType)`
```typescript
import { calculateFare } from '~/utils/pricing';

const fare = calculateFare(15, 'estate');
// Returns: 57.50
```

### `getFareBreakdown(miles, vehicleType, extras)`
```typescript
import { getFareBreakdown } from '~/utils/pricing';

const breakdown = getFareBreakdown(15, 'estate', {
  meetAndGreet: true,
  childSeat: true,
  paymentMethod: 'card'
});

// Returns:
// {
//   baseFare: 57.50,
//   extrasCost: 15.00,
//   subtotal: 72.50,
//   paymentSurcharge: 2.18 (3%),
//   totalFare: 74.68
// }
```

### `estimateFare(estimatedMiles, vehicleType)`
```typescript
import { estimateFare } from '~/utils/pricing';

const estimate = estimateFare(20, 'saloon');
// Returns: { min: 45.90, max: 56.10, average: 51.00 }
```

---

## 🔥 Pro Tips

1. **Always test after changes** - Search for rides with different distances
2. **Check console logs** - They show detailed fare calculations
3. **Round numbers** - The utility automatically rounds to 2 decimal places
4. **Use percentages** - Vehicle multipliers are percentages (15 = 15%)
5. **Keep it simple** - Complex pricing confuses customers!

---

## 📞 Need Help?

The pricing logic is in:
- **Config:** `/utils/pricing.ts` (lines 7-47)
- **Calculator:** `/utils/pricing.ts` (lines 49-70)
- **Usage:** `/pages/quote.vue` (line 648)

---

## 🎉 That's It!

You can now tweak prices anytime by editing **ONE file**! 🚀

