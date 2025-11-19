import { defineStore } from 'pinia';

interface ApiState {
  baseUrl: string;
}

export const useApiStore = defineStore('api', {
  state: (): ApiState => ({
    baseUrl: process.env.NUXT_PUBLIC_API_URL || '/api'
  }),

  actions: {
    async getAuthToken(): Promise<string | null> {
      if (process.server) return null;
      
      try {
        const nuxtApp = useNuxtApp();
        const $firebaseAuth: any = nuxtApp.$firebaseAuth;
        if (!$firebaseAuth || !$firebaseAuth.currentUser) {
          return null;
        }
        return await $firebaseAuth.currentUser.getIdToken();
      } catch (error) {
        console.warn('Failed to get auth token:', error);
        return null;
      }
    },

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Get auth token if available
      const token = await this.getAuthToken();
      
      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        }
      };

      try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        console.error('API request error:', error);
        throw error;
      }
    },

    async get<T>(endpoint: string): Promise<T> {
      return this.request<T>(endpoint, { method: 'GET' });
    },

    async post<T>(endpoint: string, body?: any): Promise<T> {
      return this.request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });
    },

    async put<T>(endpoint: string, body?: any): Promise<T> {
      return this.request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
      });
    },

    async delete<T>(endpoint: string): Promise<T> {
      return this.request<T>(endpoint, { method: 'DELETE' });
    }
  }
});

