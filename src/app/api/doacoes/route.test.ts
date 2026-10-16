import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from './route'

const { authenticateMock, createMock, findManyMock } = vi.hoisted(() => ({
  authenticateMock: vi.fn(),
  createMock: vi.fn(),
  findManyMock: vi.fn(),
}))

vi.mock('@/server/auth', () => ({
  authenticate: authenticateMock,
}))

vi.mock('@/server/prisma', () => ({
  prisma: { doacao: { create: createMock, findMany: findManyMock } },
}))

const VALID_BODY = {
  nomeCompleto: 'Maria da Silva',
  whatsapp: '93991185009',
  tipos: ['racao'],
  observacoes: '2 sacos de 10kg',
}

const createPostRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/doacoes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/doacoes', () => {
  it('should create a donation without requiring authentication', async () => {
    createMock.mockResolvedValue({ id: '1', ...VALID_BODY, status: 'pendente' })

    const response = await POST(createPostRequest(VALID_BODY))

    expect(response.status).toBe(201)
    expect(authenticateMock).not.toHaveBeenCalled()
    expect(createMock).toHaveBeenCalledWith({ data: VALID_BODY })
  })

  it('should normalize the whatsapp number and store empty observations as null', async () => {
    createMock.mockResolvedValue({ id: '1' })

    await POST(createPostRequest({ ...VALID_BODY, whatsapp: '(93) 99118-5009', observacoes: '   ' }))

    expect(createMock).toHaveBeenCalledWith({
      data: { nomeCompleto: 'Maria da Silva', whatsapp: '93991185009', tipos: ['racao'], observacoes: null },
    })
  })

  it('should return 400 with field errors when the body is invalid', async () => {
    const response = await POST(createPostRequest({ nomeCompleto: 'Ma', whatsapp: '123', tipos: ['carro'] }))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(createMock).not.toHaveBeenCalled()
    expect(Object.keys(json.details)).toEqual(expect.arrayContaining(['nomeCompleto', 'whatsapp', 'tipos']))
  })

  it('should return 400 when the body is not JSON', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/doacoes', { method: 'POST', body: 'nome=Maria' }),
    )

    expect(response.status).toBe(400)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('should return 500 when the database fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    createMock.mockRejectedValue(new Error('db down'))

    const response = await POST(createPostRequest(VALID_BODY))

    expect(response.status).toBe(500)
  })
})

describe('GET /api/doacoes', () => {
  it('should reject unauthenticated requests', async () => {
    authenticateMock.mockReturnValue({ error: new Response(null, { status: 401 }) })

    const response = await GET(new NextRequest('http://localhost/api/doacoes'))

    expect(response.status).toBe(401)
    expect(findManyMock).not.toHaveBeenCalled()
  })

  it('should list donations newest first for an authenticated admin', async () => {
    authenticateMock.mockReturnValue({ userId: '123', token: 'token' })
    findManyMock.mockResolvedValue([{ id: '1' }])

    const response = await GET(new NextRequest('http://localhost/api/doacoes'))

    expect(response.status).toBe(200)
    expect(findManyMock).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } })
    expect(await response.json()).toEqual([{ id: '1' }])
  })
})
