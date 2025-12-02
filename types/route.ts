export interface RouteLocation {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  type: 'airport' | 'city' | 'station' | 'landmark';
  description?: string;
}

export interface TaxiRoute {
  id?: string;
  fromLocation: RouteLocation;
  toLocation: RouteLocation;
  slug: string; // e.g., "gatwick-to-heathrow"
  distance: number; // in miles
  estimatedDuration: number; // in minutes
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  popularityScore: number; // 0-100, used for ranking
  seoData: {
    title: string;
    metaDescription: string;
    h1Title: string;
    keywords: string[];
  };
  content: {
    introduction: string;
    whyChooseUs: string[];
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    tips: string[];
  };
  vehicleTypes: Array<{
    type: string;
    price: number;
    description: string;
  }>;
  nearbyRoutes: string[]; // slugs of related routes
  isActive: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteSearchParams {
  from?: string;
  to?: string;
  limit?: number;
  sortBy?: 'popularity' | 'price' | 'distance';
}

