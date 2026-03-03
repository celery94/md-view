import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://www.md-view.com/sitemap.xml',
    host: 'https://www.md-view.com',
  };
}
