declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputElement: HTMLInputElement, options?: AutocompleteOptions);
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {
        types?: string[];
        componentRestrictions?: {
          country: string | string[];
        };
        fields?: string[];
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        strictBounds?: boolean;
      }

      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location: google.maps.LatLng;
          viewport: google.maps.LatLngBounds;
        };
        name?: string;
        place_id?: string;
        address_components?: AddressComponent[];
        types?: string[];
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      contains(latLng: LatLng | LatLngLiteral): boolean;
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    // Direction Service
    class DirectionsService {
      route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void;
    }

    class DirectionsRenderer {
      constructor(options?: DirectionsRendererOptions);
      setDirections(directions: DirectionsResult): void;
      setMap(map: Map): void;
    }

    interface DirectionsRequest {
      origin: string | LatLng | LatLngLiteral | Place;
      destination: string | LatLng | LatLngLiteral | Place;
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
      waypoints?: DirectionsWaypoint[];
      optimizeWaypoints?: boolean;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
    }

    interface DirectionsResult {
      routes: DirectionsRoute[];
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[];
      overview_path: LatLng[];
      overview_polyline: string;
      warnings: string[];
      bounds: LatLngBounds;
    }

    interface DirectionsLeg {
      distance: Distance;
      duration: Duration;
      start_address: string;
      end_address: string;
      start_location: LatLng;
      end_location: LatLng;
      steps: DirectionsStep[];
    }

    interface DirectionsStep {
      distance: Distance;
      duration: Duration;
      instructions: string;
      path: LatLng[];
    }

    interface DirectionsRendererOptions {
      map?: Map;
      panel?: Element;
      directions?: DirectionsResult;
      suppressMarkers?: boolean;
      suppressInfoWindows?: boolean;
      polylineOptions?: PolylineOptions;
    }

    interface PolylineOptions {
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    }

    interface DirectionsWaypoint {
      location: string | LatLng | LatLngLiteral | Place;
      stopover?: boolean;
    }

    type DirectionsStatus = 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_WAYPOINTS_EXCEEDED' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';

    // Distance Matrix Service
    class DistanceMatrixService {
      getDistanceMatrix(
        request: DistanceMatrixRequest,
        callback: (response: DistanceMatrixResponse, status: DistanceMatrixStatus) => void
      ): void;
    }

    interface DistanceMatrixRequest {
      origins: (string | LatLng | LatLngLiteral | Place)[];
      destinations: (string | LatLng | LatLngLiteral | Place)[];
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
    }

    interface DistanceMatrixResponse {
      originAddresses: string[];
      destinationAddresses: string[];
      rows: DistanceMatrixResponseRow[];
    }

    interface DistanceMatrixResponseRow {
      elements: DistanceMatrixResponseElement[];
    }

    interface DistanceMatrixResponseElement {
      status: string;
      distance?: Distance;
      duration?: Duration;
    }

    interface Distance {
      text: string;
      value: number;
    }

    interface Duration {
      text: string;
      value: number;
    }

    type DistanceMatrixStatus = 'OK' | 'INVALID_REQUEST' | 'MAX_ELEMENTS_EXCEEDED' | 'MAX_DIMENSIONS_EXCEEDED' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';

    // Map related
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(center: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    // Common enums
    enum TravelMode {
      DRIVING = 'DRIVING',
      WALKING = 'WALKING',
      BICYCLING = 'BICYCLING',
      TRANSIT = 'TRANSIT'
    }

    enum UnitSystem {
      METRIC = 0,
      IMPERIAL = 1
    }

    interface Place {
      location?: LatLng;
      placeId?: string;
      query?: string;
    }

    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      function clearInstanceListeners(instance: any): void;
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}

// Extend Window interface to include google
interface Window {
  google: typeof google;
} 