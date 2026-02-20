export const vehicleMapper = {
  'Saloon': {
    image: '/images/2.png',
    icon: 'Van', // Fallback icon name if needed
    capacity: 4,
    luggage: 2
  },
  'Estate': {
    image: '/images/3.png',
    icon: 'Van',
    capacity: 4,
    luggage: 4
  },
  'MPV': {
    image: '/images/4.png',
    icon: 'Van',
    capacity: 6,
    luggage: 4
  },
  '7 Seater': {
    image: '/images/6.png',
    icon: 'Van',
    capacity: 7,
    luggage: 5
  },
  '9 Seater': {
    image: '/images/7.png',
    icon: 'Van',
    capacity: 9,
    luggage: 6
  },
  'Wheelchair': {
    image: '/images/8.png',
    icon: 'Van',
    capacity: 4,
    luggage: 2
  }
};

export const getVehicleImage = (type: string) => {
  // Normalize type to match mapper keys
  const normalizedType = Object.keys(vehicleMapper).find(
    key => key.toLowerCase() === (type || '').toLowerCase()
  ) || 'Saloon';
  
  return vehicleMapper[normalizedType].image;
};
