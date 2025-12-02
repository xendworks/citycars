export default defineEventHandler(async (event) => {
  // Redirect to API endpoint
  return sendRedirect(event, '/api/sitemap.xml', 301);
});

