export default defineEventHandler((event) => {
  const siteUrl = 'https://citycarsgatwick.co.uk';
  
  const robotsTxt = `# robots.txt for CityCars Gatwick

User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/api/sitemap.xml
`;

  setHeader(event, 'Content-Type', 'text/plain');
  return robotsTxt;
});

