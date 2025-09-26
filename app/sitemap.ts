import { MetadataRoute } from 'next'

const baseUrl = 'https://www.md-view.com'

const lastModified = new Date('2025-09-26')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
