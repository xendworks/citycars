import { readFileSync } from 'fs';
import { join } from 'path';

export default defineEventHandler((event) => {
  // Set correct headers for XML
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  
  try {
    // Try to read from public folder first (development)
    const publicPath = join(process.cwd(), 'public', 'sitemap.xml');
    const content = readFileSync(publicPath, 'utf-8');
    return content;
  } catch (e) {
    // In production, the file might be in a different location
    try {
      const prodPath = join(process.cwd(), '.output', 'public', 'sitemap.xml');
      const content = readFileSync(prodPath, 'utf-8');
      return content;
    } catch (e2) {
      // Fallback: return a minimal sitemap
      console.error('Could not read sitemap.xml:', e2);
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://citycarsgatwick.co.uk/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;
    }
  }
});

