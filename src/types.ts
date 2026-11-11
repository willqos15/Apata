export type Species = 'cachorro' | 'gato'
export type Sex = 'macho' | 'femea'
export type Size = 'pequeno' | 'medio' | 'grande'
export type FaixaEtaria = 'Filhote' | 'Adulto' | 'Idoso'

export interface Pet {
  id: string
  nome: string
  foto: string | null
  especie: Species
  sexo: Sex
  porte: Size
  faixa_etaria?: FaixaEtaria | null
  descricao: string
  contato: string | null
  adotado: boolean
  vacinado: boolean | null
  vermifugado: boolean | null
  castrado: boolean | null
  castracaoGarantida?: boolean | null
}

export interface PetFormValues {
  nome: string
  descricao: string
  especie: Species | ''
  porte: Size | ''
  sexo: Sex | ''
  faixa_etaria?: FaixaEtaria | ''
  contato: string
  adotado: boolean
  vacinado: boolean
  vermifugado: boolean
  castrado: boolean
  castracaoGarantida: boolean
}

export interface PetFilters {
  search: string
  species: Species | ''
  sex: Sex | ''
  size: Size | ''
  adopted: boolean | ''
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface UpdateResult {
  count: number
}

export type DonationItem =
  | 'racao'
  | 'remedios'
  | 'roupas'
  | 'calcados'
  | 'livros'
  | 'artesanato'
  | 'plantas'
  | 'outro'

export interface DonationFormValues {
  nome: string
  telefone: string
  item: DonationItem | ''
  observacoes: string
}

export type DonationStatus = 'pendente' | 'contatado' | 'concluido'

export interface Donation {
  id: string
  nomeCompleto: string
  whatsapp: string
  tipos: DonationItem[]
  observacoes: string | null
  status: DonationStatus
  createdAt: string
}

export type DonationPayload = Pick<Donation, 'nomeCompleto' | 'whatsapp' | 'tipos'> & {
  observacoes?: string
}
