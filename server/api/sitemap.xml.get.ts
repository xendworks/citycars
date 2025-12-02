import { collections } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const siteUrl = 'https://citycarsgatwick.co.uk';
    
    // Fetch all active routes
    const routesSnapshot = await collections.routes()
      .where('isActive', '==', true)
      .get();

    const routes: any[] = [];
    routesSnapshot.forEach((doc) => {
      routes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Static pages
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/routes', priority: 0.9, changefreq: 'daily' },
      { url: '/airport-taxis', priority: 0.8, changefreq: 'weekly' },
      { url: '/wheel-chair-taxis', priority: 0.8, changefreq: 'weekly' },
      { url: '/contact-us', priority: 0.7, changefreq: 'monthly' },
      { url: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
      { url: '/contractor-agreement', priority: 0.5, changefreq: 'monthly' },
    ];

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    }

    // Add route pages
    for (const route of routes) {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${route.slug}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <lastmod>${route.updatedAt || new Date().toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    // Set appropriate headers
    setHeader(event, 'Content-Type', 'application/xml');
    setHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    return xml;
  } catch (error: any) {
    console.error('[API] Error generating sitemap:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to generate sitemap'
    });
  }
});

