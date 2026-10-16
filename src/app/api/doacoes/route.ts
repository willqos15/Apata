import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/server/prisma'
import { authenticate } from '@/server/auth'
import { readJsonBody } from '@/server/body'
import { donationSchema } from '@/schemas/donation-schema'

export async function GET(request: NextRequest) {
    const auth = authenticate(request)
    if ('error' in auth) return auth.error

    try {
        const doacoes = await prisma.doacao.findMany({ orderBy: { createdAt: 'desc' } })
        return NextResponse.json(doacoes, { status: 200 })
    } catch (error) {
        console.error('Erro ao listar doações:', error)
        return NextResponse.json({ error: 'Erro ao buscar doações' }, { status: 500 })
    }
}

// Público: quem doa é um visitante, sem login.
export async function POST(request: NextRequest) {
    let body
    try {
        body = await readJsonBody(request)
    } catch {
        return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    const parsed = donationSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Dados inválidos', details: z.flattenError(parsed.error).fieldErrors },
            { status: 400 },
        )
    }

    try {
        const { nomeCompleto, whatsapp, tipos, observacoes } = parsed.data
        const doacao = await prisma.doacao.create({
            data: { nomeCompleto, whatsapp, tipos, observacoes: observacoes || null },
        })
        return NextResponse.json(doacao, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar doação:', error)
        return NextResponse.json({ error: 'Erro ao registrar doação' }, { status: 500 })
    }
}
