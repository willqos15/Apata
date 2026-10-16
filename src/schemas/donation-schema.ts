import { z } from 'zod'
import type { DonationItem } from '@/types'

export const OBSERVATION_LIMIT = 500

const DONATION_ITEM_VALUES = [
  'racao',
  'remedios',
  'roupas',
  'calcados',
  'livros',
  'artesanato',
  'plantas',
  'outro',
] as const satisfies readonly DonationItem[]

// Valida o body do POST /api/doacoes. Os nomes seguem o model `Doacao` do Prisma.
export const donationSchema = z.object({
  nomeCompleto: z.string().trim().min(3, 'Informe pelo menos 3 caracteres'),
  whatsapp: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{10,11}$/, 'Informe o DDD e o número (10 ou 11 dígitos)')),
  tipos: z.array(z.enum(DONATION_ITEM_VALUES)).min(1, 'Selecione pelo menos um item'),
  observacoes: z.string().trim().max(OBSERVATION_LIMIT, `Máximo de ${OBSERVATION_LIMIT} caracteres`).optional(),
})

export type DonationInput = z.output<typeof donationSchema>
