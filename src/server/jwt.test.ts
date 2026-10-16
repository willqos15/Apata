import { describe, it, expect } from "vitest";
import { getTokenRemainingTime } from "./jwt";
import { sign } from "jsonwebtoken";


const mockedSecret = process.env.JWT_SECRET
if (!mockedSecret) throw new Error("Invalid jwt token")


describe('getTokenRemainingTime', () => {

  it('should return null when token is empty', () => {
    const time = getTokenRemainingTime('')

    expect(time).toBeNull()
  })

  it('should return the remaining time when token is valid', () => {
    const token = sign(
      { id: '123' },
      mockedSecret,
      { expiresIn: '1d' }
    )

    const time = getTokenRemainingTime(token)

    expect(time).toBeGreaterThan(0)
  })

  it('should return null when token has no expiration', () => {
    const token = sign(
      { id: '123' },
      mockedSecret
    )

    const time = getTokenRemainingTime(token)

    expect(time).toBeNull()
  })

  it('should return null when token is invalid', () => {
    const time = getTokenRemainingTime('invalid-token')

    expect(time).toBeNull()
  })

  it('should return null when token is expired', () => {
    const token = sign(
      { id: '123' },
      mockedSecret,
      { expiresIn: -1 }
    )

    const time = getTokenRemainingTime(token)

    expect(time).toBeNull()
  })
})

