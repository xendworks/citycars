<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 class="text-4xl font-bold mb-4">🗺️ Sitemap - All Routes</h1>
        <p class="text-gray-600 mb-6">
          Total Routes: <strong class="text-amber-600 text-2xl">{{ routes.length }}</strong>
        </p>
        
        <div class="flex gap-4 mb-6">
          <button 
            @click="copyAllUrls"
            class="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600"
          >
            📋 Copy All URLs
          </button>
          <button 
            @click="downloadSitemap"
            class="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            ⬇️ Download sitemap.xml
          </button>
          <a 
            href="/api/sitemap.xml" 
            target="_blank"
            class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            🌐 View XML Sitemap
          </a>
        </div>
        
        <div v-if="copied" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Copied {{ routes.length }} URLs to clipboard!
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-lg p-6">
        <input 
          v-model="search"
          type="text"
          placeholder="Search routes..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        
        <div class="text-sm text-gray-600 mb-4">
          Showing {{ filteredRoutes.length }} routes
        </div>
        
        <div class="space-y-2 max-h-[600px] overflow-y-auto">
          <div 
            v-for="route in filteredRoutes" 
            :key="route.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <div class="flex-1">
              <div class="font-semibold text-gray-900">
                {{ route.fromLocation.name }} → {{ route.toLocation.name }}
              </div>
              <div class="text-sm text-gray-500 font-mono">
                /{{ route.slug }}
              </div>
            </div>
            <div class="flex gap-2">
              <a 
                :href="`/${route.slug}`" 
                target="_blank"
                class="bg-amber-500 text-white px-4 py-2 rounded text-sm hover:bg-amber-600"
              >
                View
              </a>
              <button 
                @click="copyUrl(route.slug)"
                class="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

definePageMeta({
  layout: false
});

const routes = ref([]);
const search = ref('');
const copied = ref(false);

const filteredRoutes = computed(() => {
  if (!search.value) return routes.value;
  const s = search.value.toLowerCase();
  return routes.value.filter(r => 
    r.slug.includes(s) || 
    r.fromLocation.name.toLowerCase().includes(s) ||
    r.toLocation.name.toLowerCase().includes(s)
  );
});

onMounted(async () => {
  const { $firebase } = useNuxtApp();
  const db = getFirestore($firebase);
  
  const q = query(collection(db, 'routes'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  
  routes.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  console.log(`Loaded ${routes.value.length} routes`);
});

const copyUrl = (slug) => {
  const url = `https://citycarsgatwick.co.uk/routes/${slug}`;
  navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};

const copyAllUrls = () => {
  const urls = routes.value.map(r => `https://citycarsgatwick.co.uk/routes/${r.slug}`).join('\n');
  navigator.clipboard.writeText(urls);
  copied.value = true;
  setTimeout(() => copied.value = false, 3000);
};

const downloadSitemap = () => {
  const siteUrl = 'https://citycarsgatwick.co.uk';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Static pages
  xml += `  <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${siteUrl}/routes</loc><priority>0.9</priority></url>\n`;
  
  // Route pages
  routes.value.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>${siteUrl}/${route.slug}</loc>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `  </url>\n`;
  });
  
  xml += '</urlset>';
  
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  a.click();
};
</script>

