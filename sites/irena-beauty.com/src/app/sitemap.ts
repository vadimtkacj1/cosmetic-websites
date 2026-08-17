import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://irena-beauty.com/',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://irena-beauty.com/accessibility',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
