import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { WDXL_Lubrifont_JP_N } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Navbar from '@/components/Navbar'
import MFooter from '@/components/MFooter'
import ScrollToTop from '@/components/ScrollToTop'
import { BASE_OPEN_GRAPH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

const wdxl = WDXL_Lubrifont_JP_N({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-wdxl',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Adoção de Cães e Gatos em Altamira (PA) | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: '/logoapata.svg' },
  openGraph: BASE_OPEN_GRAPH,
  twitter: { card: 'summary' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={wdxl.variable}>
      <body>
        <Providers>
          <div id="root">
            <ScrollToTop />
            <Navbar />
            {children}
            <MFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
