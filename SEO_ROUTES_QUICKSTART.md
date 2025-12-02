# SEO Routes - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Seed Initial Routes

```bash
pnpm run seed:routes
```

This creates ~27 popular taxi routes automatically.

### Step 2: Update Firestore Rules

Copy the rules from `FIRESTORE_ROUTES_RULES.txt` and add them to your Firestore Security Rules in the Firebase Console.

### Step 3: View Routes

Open your browser:
- Browse routes: `http://localhost:3000/routes`
- Example route: `http://localhost:3000/routes/gatwick-to-heathrow`
- Admin panel: `http://localhost:3000/admin/routes`

### Step 4: Submit Sitemap to Google

1. Go to Google Search Console
2. Add your sitemap: `https://yourdomain.com/sitemap.xml`
3. Wait for Google to crawl your pages

## 📝 Quick Examples

### View All Routes
```
GET /api/routes
GET /api/routes?sortBy=popularity&limit=20
```

### Get Single Route
```
GET /api/routes/gatwick-to-heathrow
```

### Create Route via Admin
1. Go to `/admin/routes`
2. Click "Add New Route"
3. Fill in the form
4. Click "Create Route"

## 🎯 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Routes Index | `/routes` | Browse all routes |
| Single Route | `/routes/[slug]` | Individual route page |
| Admin Dashboard | `/admin/routes` | Manage routes |
| Sitemap | `/sitemap.xml` | For search engines |
| API - List | `/api/routes` | Get all routes (API) |
| API - Single | `/api/routes/[slug]` | Get one route (API) |

## 🔍 SEO Checklist

- [x] Dynamic meta tags per route
- [x] Structured data (JSON-LD)
- [x] Sitemap generation
- [x] Robots.txt configured
- [x] Server-side rendering (SSR)
- [x] Unique content per route
- [x] Internal linking (related routes)
- [x] Mobile-responsive design

## 📊 Monitor Performance

Check `/admin/routes` to see:
- Total routes created
- Active vs inactive routes
- Total views across all routes
- Average pricing

## 🛠️ Common Tasks

### Add a New Route
1. Admin: `/admin/routes` → "Add New Route"
2. Fill in locations, distance, duration, pricing
3. Save

### Edit Route Content
1. Admin: `/admin/routes`
2. Find the route
3. Click "Edit"
4. Update and save

### Disable a Route
1. Admin: `/admin/routes`
2. Find the route
3. Click "Disable"

### View Route Performance
Check the "Views" column in the admin table to see which routes are most popular.

## 🎨 Customize

### Update Route Template
Edit: `pages/routes/[slug].vue`

### Change SEO Data
Edit routes via admin or directly in Firestore.

### Add More Locations
Edit: `scripts/seed-routes.mjs` and re-run seed script.

## 📈 Next Steps

1. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools

2. **Monitor Rankings**
   - Track target keywords
   - Check traffic in Google Analytics

3. **Optimize**
   - Update low-performing routes
   - Add more FAQs
   - Improve content

4. **Expand**
   - Add more routes
   - Create city-specific pages
   - Add customer reviews

## 🆘 Troubleshooting

### Routes not showing?
- Check if route is active
- Verify Firestore connection
- Check browser console for errors

### Sitemap empty?
- Verify routes exist in Firestore
- Check `/api/sitemap.xml` directly
- Ensure routes are active

### Admin access denied?
- Check user role in Firestore
- Verify authentication
- Check middleware configuration

## 📚 Full Documentation

See `SEO_ROUTES_GUIDE.md` for complete documentation.

