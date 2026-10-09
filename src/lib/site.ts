import type { Metadata } from 'next'
import logoApata from '@/img/logoapata.png'

// Canonical origin used by metadata, sitemap.xml and robots.txt. Set SITE_URL in production
// (e.g. https://apata.org.br); on Vercel it falls back to the project's production domain.
function resolveSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = 'APATA Altamira'
export const SITE_DESCRIPTION =
  'Adote um cão ou gato em Altamira (PA). A APATA é uma associação sem fins lucrativos de proteção animal: adoção, doações, PIX solidário e voluntariado.'

// A page that sets its own openGraph replaces the parent's object entirely, so it spreads this.
export const BASE_OPEN_GRAPH = {
  type: 'website',
  locale: 'pt_BR',
  siteName: SITE_NAME,
  images: [{ url: logoApata.src, width: logoApata.width, height: logoApata.height, alt: 'Logo da APATA' }],
} satisfies Metadata['openGraph']
