import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Only public, indexable pages. Admin routes (/painel, /cadastro, /gerenciar) stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/doar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
