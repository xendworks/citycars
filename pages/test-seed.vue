<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold mb-6">TEST SEED (No Auth Check)</h1>
      
      <div v-if="!started">
        <button 
          @click="doSeed"
          class="bg-amber-500 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-amber-600"
        >
          START SEEDING
        </button>
      </div>

      <div v-else>
        <h2 class="text-xl font-bold mb-4">Progress: {{ progress }}</h2>
        <div class="space-y-2">
          <div v-for="log in logs" :key="log" class="text-sm">{{ log }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// NO MIDDLEWARE - NO LAYOUT
definePageMeta({
  layout: false
});

const started = ref(false);
const progress = ref('');
const logs = ref<string[]>([]);

const doSeed = async () => {
  started.value = true;
  logs.value = [];
  
  try {
    logs.value.push('🌱 Starting...');
    
    const { $firebase } = useNuxtApp();
    
    if (!$firebase) {
      logs.value.push('❌ Firebase not initialized');
      return;
    }
    
    logs.value.push('✅ Firebase initialized');
    
    const db = getFirestore($firebase as any);
    logs.value.push('✅ Firestore connected');
    
    const routesCollection = collection(db, 'routes');
    logs.value.push('✅ Routes collection ready');
    
    // Create ONE simple test route
    const testRoute = {
      fromLocation: { 
        name: 'Gatwick Airport', 
        slug: 'gatwick-airport', 
        latitude: 51.1537, 
        longitude: -0.1821, 
        type: 'airport' 
      },
      toLocation: { 
        name: 'Heathrow Airport', 
        slug: 'heathrow-airport', 
        latitude: 51.4700, 
        longitude: -0.4543, 
        type: 'airport' 
      },
      slug: `test-gatwick-to-heathrow-${Date.now()}`,
      distance: 40,
      estimatedDuration: 60,
      averagePrice: 89,
      priceRange: { min: 80, max: 107 },
      popularityScore: 95,
      seoData: {
        title: 'Test Route',
        metaDescription: 'Test',
        h1Title: 'Test',
        keywords: ['test']
      },
      content: {
        introduction: 'Test route',
        whyChooseUs: ['Test'],
        faqs: [],
        tips: []
      },
      vehicleTypes: [],
      nearbyRoutes: [],
      isActive: true,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    logs.value.push('📝 Creating test route...');
    
    const docRef = await addDoc(routesCollection, testRoute);
    
    logs.value.push(`✅ SUCCESS! Created route with ID: ${docRef.id}`);
    logs.value.push('🎉 ALL DONE!');
    
    progress.value = 'COMPLETE!';
    
  } catch (error: any) {
    logs.value.push(`❌ ERROR: ${error.message}`);
    console.error('Full error:', error);
    progress.value = 'FAILED';
  }
};
</script>

