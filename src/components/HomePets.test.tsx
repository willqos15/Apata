import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HomePets from './HomePets'
import { listPets } from '@/lib/api'
import type { Pet } from '@/types'

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
  },
]

vi.mock('@/lib/api', () => ({
  listPets: vi.fn(),
}))

vi.mock('./Item', () => ({
  default: ({ pet }: { pet: Pet }) => <div data-testid="pet-item">{pet.nome}</div>,
}))

vi.mock('./PetsLoadingMessage', () => ({
  default: () => <div data-testid="pets-loading">Carregando pets</div>,
}))

const mockedListPets = vi.mocked(listPets)

describe('HomePets', () => {
  const renderWithQueryProvider = (initialPets: Pet[] | null = pets) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    return render(
      <QueryClientProvider client={queryClient}>
        <HomePets initialPets={initialPets} />
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the pet list with the initial data', () => {
    renderWithQueryProvider()

    expect(screen.getByText('Adotar um animal:')).toBeInTheDocument()
    expect(screen.getByTestId('pet-item')).toHaveTextContent('Rex')
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
  })

  it('should render the empty state when there are no pets', () => {
    renderWithQueryProvider([])

    expect(screen.getByText('Nenhum animal encontrado.')).toBeInTheDocument()
    expect(screen.queryByTestId('pet-item')).not.toBeInTheDocument()
  })

  it('should render pets returned by the API', async () => {
    const mockedPets: Pet[] = [
      {
        ...pets[0],
        id: 'pet-2',
        nome: 'Luna',
        especie: 'gato',
        sexo: 'femea',
        porte: 'pequeno',
      },
      {
        ...pets[0],
        id: 'pet-3',
        nome: 'Thor',
      },
    ]
    mockedListPets.mockResolvedValueOnce(mockedPets)

    renderWithQueryProvider(null)

    expect(await screen.findByText('Luna')).toBeInTheDocument()
    expect(screen.getByText('Thor')).toBeInTheDocument()
    expect(screen.getAllByTestId('pet-item')).toHaveLength(2)
  })

  it('should render Pagination when the API returns more than 12 pets', async () => {
    const mockedPets: Pet[] = Array.from({ length: 13 }, (_, index) => ({
      ...pets[0],
      id: `pet-${index + 1}`,
      nome: `Pet ${index + 1}`,
    }))
    mockedListPets.mockResolvedValueOnce(mockedPets)

    renderWithQueryProvider(null)

    expect(await screen.findByText('Pet 1')).toBeInTheDocument()
    expect(screen.getAllByTestId('pet-item')).toHaveLength(12)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima página' })).not.toBeDisabled()
  })

  it('should reduce pagination when filtering the pets', async () => {
    const mockedPets: Pet[] = [
      ...Array.from({ length: 10 }, (_, index) => ({
        ...pets[0],
        id: `dog-${index + 1}`,
        nome: `Cachorro ${index + 1}`,
      })),
      ...Array.from({ length: 3 }, (_, index) => ({
        ...pets[0],
        id: `cat-${index + 1}`,
        nome: `Gato ${index + 1}`,
        especie: 'gato' as const,
      })),
    ]
    mockedListPets.mockResolvedValueOnce(mockedPets)

    renderWithQueryProvider(null)

    expect(await screen.findByText('Cachorro 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Espécie'), { target: { value: 'gato' } })

    expect(screen.getAllByTestId('pet-item')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: 'Página anterior' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Próxima página' })).not.toBeInTheDocument()
  })

  it('should render the error message when listing pets fails', async () => {
    mockedListPets.mockRejectedValueOnce(new Error('Request failed'))

    renderWithQueryProvider(null)

    await waitFor(() => {
      expect(screen.getByText('Algo deu errado. Tente novamente.')).toBeInTheDocument()
    })

    expect(screen.queryByLabelText('Buscar')).not.toBeInTheDocument()
  })
})
