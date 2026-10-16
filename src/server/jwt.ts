import { JwtPayload, sign, verify } from 'jsonwebtoken'

const EXPIRES_IN = '7d'

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET não definido')
  return secret
}

export function signToken(id: string): string {
  return sign({ id }, jwtSecret(), { expiresIn: EXPIRES_IN })
}

export function verifyToken(token: string): string {
  const decoded = verify(token, jwtSecret())
  if (typeof decoded === 'string' || typeof decoded.id !== 'string') throw new Error('Token inválido')
  return decoded.id
}


export function getTokenRemainingTime(token: string): number | null {
  if (token === '') return null

  try {
    const payload = verify(token, jwtSecret()) as JwtPayload

    if (!payload.exp) return null

    return payload.exp * 1000 - Date.now()
  } catch (err) {
    console.error('Erro ao verificar token:', err)
    return null
  }
}