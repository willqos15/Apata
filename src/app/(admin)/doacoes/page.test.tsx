import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DoacoesPage from './page'

const { session, list, redirect } = vi.hoisted(() => ({
  session: vi.fn(), list: vi.fn(), redirect: vi.fn(),
}))

vi.mock('@/hooks/useSession', () => ({ useSession: session }))
vi.mock('@/lib/api', () => ({ listDonations: list }))
vi.mock('next/navigation', () => ({ redirect }))
vi.mock('@/components/Spinner', () => ({ default: () => <span>Carregando...</span> }))

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}><DoacoesPage /></QueryClientProvider>)
}

describe('Doações', () => {
  beforeEach(() => vi.resetAllMocks())
  afterEach(cleanup)

  it('não consulta doações enquanto a sessão está sendo validada', () => {
    session.mockReturnValue(undefined)
    renderPage()
    expect(list).not.toHaveBeenCalled()
  })

  it('redireciona sessões inválidas sem consultar doações', () => {
    session.mockReturnValue(false)
    renderPage()
    expect(redirect).toHaveBeenCalledWith('/painel')
    expect(list).not.toHaveBeenCalled()
  })

  it('exibe contatos, itens e apenas as observações preenchidas', async () => {
    session.mockReturnValue(true)
    list.mockResolvedValue([
      { id: '1', nomeCompleto: 'Ana Silva', whatsapp: '(93) 99999-1234', tipos: ['racao', 'livros'], observacoes: 'Retirar à tarde' },
      { id: '2', nomeCompleto: 'João', whatsapp: '+55 (93) 98888-1234', tipos: ['roupas'], observacoes: null },
    ])
    renderPage()
    expect(await screen.findByText('Ana Silva')).toBeInTheDocument()
    expect(screen.getByText('Ração, Livros')).toBeInTheDocument()
    expect(screen.getByText(/Retirar à tarde/)).toBeInTheDocument()
    expect(screen.getAllByText('Observações:')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Ana Silva/ })).toHaveAttribute('href', 'https://wa.me/5593999991234')
    expect(screen.getByRole('link', { name: /João/ })).toHaveAttribute('href', 'https://wa.me/5593988881234')
  })

  it('informa quando não existem doações', async () => {
    session.mockReturnValue(true)
    list.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Nenhuma doação cadastrada.')).toBeInTheDocument()
  })

  it('exibe erro e permite tentar novamente', async () => {
    session.mockReturnValue(true)
    list.mockRejectedValue(new Error('Falha de rede'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar as doações.')
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })
})