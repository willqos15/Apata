import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Pet } from '@/types'
import GerenciarPage from './page'

const { deletePetMock, listPetsMock, redirectMock, updatePetMock } = vi.hoisted(() => ({
  deletePetMock: vi.fn(),
  listPetsMock: vi.fn(),
  redirectMock: vi.fn(),
  updatePetMock: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

vi.mock('@/hooks/useSession', () => ({
  useSession: () => true,
}))

vi.mock('@/lib/api', () => ({
  deletePet: deletePetMock,
  listPets: listPetsMock,
  updatePet: updatePetMock,
}))

vi.mock('@/components/Item', () => ({
  default: ({ pet, admin }: { pet: Pet; admin: boolean }) => (
    <div data-testid="pet-item" data-admin={String(admin)}>
      {pet.nome}
    </div>
  ),
}))

const pets: Pet[] = [
  {
    id: 'pet-1',
    nome: 'Rex',
    foto: null,
    especie: 'cachorro',
    sexo: 'macho',
    porte: 'medio',
    descricao: 'Cachorro dócil',
    contato: null,
    vacinado: true,
    vermifugado: true,
    castrado: false,
    adotado: false,
  },
]

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <GerenciarPage />
    </QueryClientProvider>,
  )
}

describe('GerenciarPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listPetsMock.mockResolvedValue(pets)
  })

  it('should render the donor contact link and pet filters', async () => {
    renderPage()

    expect(await screen.findByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Contato de Doadores')).toBeInTheDocument()
    expect(screen.getByText('Filtrar')).toBeInTheDocument()
    expect(screen.getByLabelText('Espécie')).toBeInTheDocument()
    expect(screen.getByLabelText('Sexo')).toBeInTheDocument()
    expect(screen.getByLabelText('Porte')).toBeInTheDocument()
  })

  it('should render the adopted filter for the admin page', async () => {
    renderPage()

    expect(await screen.findByLabelText('Adotado')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Sim' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Não' })).toBeInTheDocument()
  })

  it('should render pets with admin controls enabled', async () => {
    renderPage()

    const petItem = await screen.findByTestId('pet-item')

    expect(petItem).toHaveTextContent('Rex')
    expect(petItem).toHaveAttribute('data-admin', 'true')
  })

  it('should filter pets by the adopted status', async () => {
    listPetsMock.mockResolvedValue([
      ...pets,
      { ...pets[0], id: 'pet-2', nome: 'Mimi', adotado: true },
    ])

    renderPage()
    await screen.findByText('Mimi')

    fireEvent.change(screen.getByLabelText('Adotado'), { target: { value: 'true' } })

    expect(screen.getByTestId('pet-item')).toHaveTextContent('Mimi')
    expect(screen.queryByText('Rex')).not.toBeInTheDocument()
  })

  it('should render the empty state when no pets match', async () => {
    listPetsMock.mockResolvedValue([])

    renderPage()

    expect(await screen.findByText('Nenhum animal encontrado.')).toBeInTheDocument()
  })
})