import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Área Restrita',
  robots: { index: false, follow: false },
}

export default function PainelLayout({ children }: { children: ReactNode }) {
  return children
}
