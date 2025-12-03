import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
      : null;
    
    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      initializeApp({
        projectId: 'city-cars-83256'
      });
    }
  } catch (e) {
    console.error('Firebase Admin init error:', e);
  }
}

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://citycarsgatwick.co.uk';
  
  // Set XML content type
  setHeader(event, 'Content-Type', 'application/xml');
  setHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  
  try {
    const db = getFirestore();
    const routesSnapshot = await db.collection('routes')
      .where('isActive', '==', true)
      .get();
    
    const routes = routesSnapshot.docs.map(doc => ({
      slug: doc.data().slug,
      updatedAt: doc.data().updatedAt || doc.data().createdAt || new Date().toISOString()
    }));
    
    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Static pages
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/quote', priority: '0.9', changefreq: 'daily' },
      { loc: '/airport-taxis', priority: '0.8', changefreq: 'weekly' },
      { loc: '/wheel-chair-taxis', priority: '0.8', changefreq: 'weekly' },
      { loc: '/contact-us', priority: '0.7', changefreq: 'monthly' },
      { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { loc: '/contractor-agreement', priority: '0.3', changefreq: 'yearly' },
    ];
    
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}${page.loc}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }
    
    // Dynamic route pages
    for (const route of routes) {
      const lastmod = route.updatedAt ? route.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0];
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${route.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return a basic sitemap if database fails
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${siteUrl}/quote</loc>\n    <priority>0.9</priority>\n  </url>\n`;
    xml += '</urlset>';
    
    return xml;
  }
});
