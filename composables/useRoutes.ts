import type { TaxiRoute, RouteSearchParams } from '~/types/route';

export const useRoutes = () => {
  const config = useRuntimeConfig();

  /**
   * Fetch all routes with optional filters
   */
  const fetchRoutes = async (params: RouteSearchParams = {}): Promise<TaxiRoute[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const response = await $fetch<{ success: boolean; routes: TaxiRoute[] }>(
        `/api/routes?${queryParams.toString()}`
      );

      return response.routes || [];
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  };

  /**
   * Fetch a single route by slug
   */
  const fetchRouteBySlug = async (slug: string): Promise<{ route: TaxiRoute | null; nearbyRoutes: TaxiRoute[] }> => {
    try {
      const response = await $fetch<{ success: boolean; route: TaxiRoute; nearbyRoutes: TaxiRoute[] }>(
        `/api/routes/${slug}`
      );

      return {
        route: response.route || null,
        nearbyRoutes: response.nearbyRoutes || []
      };
    } catch (error) {
      console.error(`Error fetching route ${slug}:`, error);
      return { route: null, nearbyRoutes: [] };
    }
  };

  /**
   * Create a new route
   */
  const createRoute = async (route: Partial<TaxiRoute>): Promise<{ success: boolean; id?: string; route?: TaxiRoute }> => {
    try {
      const response = await $fetch<{ success: boolean; id: string; route: TaxiRoute }>(
        '/api/routes',
        {
          method: 'POST',
          body: route
        }
      );

      return response;
    } catch (error: any) {
      console.error('Error creating route:', error);
      return { success: false };
    }
  };

  /**
   * Update an existing route
   */
  const updateRoute = async (slug: string, updates: Partial<TaxiRoute>): Promise<{ success: boolean; route?: TaxiRoute }> => {
    try {
      const response = await $fetch<{ success: boolean; route: TaxiRoute }>(
        `/api/routes/${slug}`,
        {
          method: 'PUT',
          body: updates
        }
      );

      return response;
    } catch (error: any) {
      console.error('Error updating route:', error);
      return { success: false };
    }
  };

  /**
   * Generate route slug from location names
   */
  const generateSlug = (from: string, to: string): string => {
    const slugify = (text: string) => 
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    
    return `${slugify(from)}-to-${slugify(to)}`;
  };

  /**
   * Get popular routes
   */
  const getPopularRoutes = async (limit: number = 10): Promise<TaxiRoute[]> => {
    return fetchRoutes({ sortBy: 'popularity', limit });
  };

  return {
    fetchRoutes,
    fetchRouteBySlug,
    createRoute,
    updateRoute,
    generateSlug,
    getPopularRoutes
  };
};

