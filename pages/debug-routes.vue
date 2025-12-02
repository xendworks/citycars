<template>
  <div style="padding: 40px; background: #1a1a1a; color: white; min-height: 100vh;">
    <h1 style="font-size: 32px; margin-bottom: 20px;">🔍 Route Debugger</h1>
    
    <div v-if="loading" style="padding: 20px; background: #2a2a2a; border-radius: 10px;">
      Loading routes from Firestore...
    </div>
    
    <div v-else style="padding: 20px; background: #2a2a2a; border-radius: 10px;">
      <h2 style="font-size: 24px; margin-bottom: 15px;">Total Routes: {{ routes.length }}</h2>
      
      <div v-if="routes.length > 0" style="margin-top: 20px;">
        <h3 style="margin-bottom: 10px;">Click to test:</h3>
        <div v-for="route in routes.slice(0, 30)" :key="route.id" style="margin-bottom: 10px;">
          <a 
            :href="`/${route.slug}`" 
            target="_blank"
            style="color: #f59e0b; text-decoration: none; display: block; padding: 10px; background: #333; border-radius: 5px;"
          >
            {{ route.fromLocation.name }} → {{ route.toLocation.name }}
            <br/>
            <span style="color: #999; font-size: 12px; font-family: monospace;">/{{ route.slug }}</span>
          </a>
        </div>
      </div>
      
      <div v-else style="color: #ef4444;">
        ❌ NO ROUTES FOUND IN FIRESTORE!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query, where, limit } from 'firebase/firestore';

definePageMeta({
  layout: false
});

const routes = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { $firebase } = useNuxtApp();
    const db = getFirestore($firebase);
    
    console.log('Fetching routes from Firestore...');
    
    const q = query(collection(db, 'routes'), where('isActive', '==', true), limit(50));
    const snapshot = await getDocs(q);
    
    routes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${routes.value.length} routes`);
    console.log('First route:', routes.value[0]);
    
    loading.value = false;
  } catch (error) {
    console.error('Error:', error);
    loading.value = false;
  }
});
</script>

