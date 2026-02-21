export const CAB_TYPES = {
  saloon: {
    id: 'saloon',
    name: 'Saloon',
    passengerCapacity: 4,
    luggageCapacity: 2,
    description: 'Capacity: 4 passengers + 2 medium pieces of luggage (suitcases) + 2 hand luggage items.\nCommon Models: Toyota Prius, Skoda Octavia, Ford Mondeo, Hyundai i30, Vauxhall Insignia, BMW 5 Series.',
    imageUrl: '/images/2.png'
  },
  estate: {
    id: 'estate',
    name: 'Estate',
    passengerCapacity: 4,
    luggageCapacity: 4,
    description: 'Luggage Space: Specifically used for large bags, pushchairs, and airport runs.\nCommon Models: Skoda Superb Estate, VW Passat Estate, Mercedes E-Class Estate.',
    imageUrl: '/images/3.png'
  },
  mpv: {
    id: 'mpv',
    name: 'MPV',
    passengerCapacity: 6,
    luggageCapacity: 4,
    description: 'Capacity: 6 passengers + 4 luggage.\nCommon Models: VW Touran, Ford Galaxy, Vauxhall Zafira.',
    imageUrl: '/images/4.png'
  },
  '7seater': {
    id: '7seater',
    name: '7 Seater',
    passengerCapacity: 7,
    luggageCapacity: 5,
    description: 'Premium/Executive: Mercedes V-Class. Standard: Ford Galaxy, VW Sharan, Hyundai i800. Compact: Ford Tourneo Connect, VW ID. Buzz.',
    imageUrl: '/images/6.png'
  },
  '9seater': {
    id: '9seater',
    name: '9 Seater',
    passengerCapacity: 9,
    luggageCapacity: 6,
    description: 'Large minibus perfect for bigger groups and tours. Features extensive seating and great luggage capacity.',
    imageUrl: '/images/7.png'
  },
  wheelchair: {
    id: 'wheelchair',
    name: 'Wheelchair',
    passengerCapacity: 4,
    luggageCapacity: 2,
    description: 'Fully accessible vehicles equipped with ramps and secure tie-downs for comfortable wheelchair travel.',
    imageUrl: '/images/8.png'
  }
};

export function suggestVehicleType(passengers: number, luggages: number): string {
  if (passengers <= 4 && luggages <= 2) return 'saloon';
  if (passengers <= 4 && luggages >= 3 && luggages <= 4) return 'estate';
  if (passengers >= 5 && passengers <= 6 && luggages <= 4) return 'mpv';
  if (passengers <= 7 && luggages <= 5) return '7seater';
  if (passengers <= 9 && luggages <= 6) return '9seater';
  return '9seater'; // fallback for very large groups
}
