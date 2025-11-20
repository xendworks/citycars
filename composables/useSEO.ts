export const useSEO = (config: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  const siteUrl = 'https://citycarsgatwick.co.uk';
  const defaultImage = '/og-image.png';
  
  const fullUrl = config.url ? `${siteUrl}${config.url}` : siteUrl;
  const imageUrl = config.image ? config.image : `${siteUrl}${defaultImage}`;
  
  useHead({
    title: config.title,
    meta: [
      // Primary Meta Tags
      { name: 'title', content: config.title },
      { name: 'description', content: config.description },
      
      // Open Graph / Facebook
      { property: 'og:type', content: config.type || 'website' },
      { property: 'og:url', content: fullUrl },
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'CityCars Gatwick' },
      
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: fullUrl },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: imageUrl },
      
      // Additional SEO
      { name: 'robots', content: 'index, follow' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'author', content: 'CityCars Gatwick' },
      { name: 'keywords', content: 'gatwick taxi, airport transfers, wheelchair accessible taxis, gatwick airport, city cars, minicab, private hire' },
    ],
    link: [
      { rel: 'canonical', href: fullUrl }
    ]
  });
};

