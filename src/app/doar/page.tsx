import type { Metadata } from 'next'
import DonationForm from '@/components/DonationForm'
import { BASE_OPEN_GRAPH } from '@/lib/site'

const DESCRIPTION =
  'Cadastre seu interesse em doar para a APATA - ração, remédios veterinários, roupas, calçados, livros, artesanato e plantas.'

export const metadata: Metadata = {
  title: 'Quero Doar',
  description: DESCRIPTION,
  alternates: { canonical: '/doar' },
  openGraph: { ...BASE_OPEN_GRAPH, url: '/doar', title: 'Quero Doar | APATA Altamira', description: DESCRIPTION },
}

export default function DoarPage() {
  return <DonationForm />
}
