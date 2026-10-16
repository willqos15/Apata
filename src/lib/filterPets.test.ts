import { describe, expect, it } from 'vitest'
import type { Pet } from '@/types'
import { EMPTY_FILTERS, filterPets } from './filterPets'
const pets: Pet[] = [
    {
      id: '1',
      nome: 'Rex',
      foto: null,
      especie: 'cachorro',
      sexo: 'macho',
      porte: 'medio',
      descricao: '',
      contato: null,
      vacinado: false,
      vermifugado: false,
      castrado: false,
      adotado: true,
    },
    {
      id: '2',
      nome: 'Mimi',
      foto: null,
      especie: 'gato',
      sexo: 'femea',
      porte: 'pequeno',
      descricao: '',
      contato: null,
      vacinado: false,
      vermifugado: false,
      castrado: false,
      adotado: false,
    },
  ]
describe('filterPets search filter', () => {
  it('should return pets whose names contain the search text', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, search: 'ex' })

    expect(result.map((pet) => pet.nome)).toEqual(['Rex'])
  })

  it('should search pet names without case sensitivity', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, search: 'MIMI' })

    expect(result.map((pet) => pet.nome)).toEqual(['Mimi'])
  })

  it('should return all pets when the search text is empty', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, search: '' })

    expect(result).toEqual(pets)
  })

  it('should return no pets when no name matches the search text', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, search: 'Luna' })

    expect(result).toEqual([])
  })
})

describe('filterPets species filter', () => {
  it('should return only dogs when the species filter is cachorro', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, species: 'cachorro' })

    expect(result.map((pet) => pet.nome)).toEqual(['Rex'])
  })

  it('should return only cats when the species filter is gato', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, species: 'gato' })

    expect(result.map((pet) => pet.nome)).toEqual(['Mimi'])
  })

  it('should return all species when the species filter is empty', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, species: '' })

    expect(result).toEqual(pets)
  })
})

describe('filterPets sex filter', () => {
  it('should return only male pets when the sex filter is macho', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, sex: 'macho' })

    expect(result.map((pet) => pet.nome)).toEqual(['Rex'])
  })

  it('should return only female pets when the sex filter is femea', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, sex: 'femea' })

    expect(result.map((pet) => pet.nome)).toEqual(['Mimi'])
  })

  it('should return all pets when the sex filter is empty', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, sex: '' })

    expect(result).toEqual(pets)
  })
})

describe('filterPets size filter', () => {
  it('should return only pets matching the selected size', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, size: 'medio' })

    expect(result.map((pet) => pet.nome)).toEqual(['Rex'])
  })

  it('should return all pets when the size filter is empty', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, size: '' })

    expect(result).toEqual(pets)
  })
})

describe('filterPets adopted filter', () => {
  it('should return only adopted pets when the adopted filter is true', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, adopted: true })

    expect(result.map((pet) => pet.nome)).toEqual(['Rex'])
  })

  it('should return only pets that are not adopted when the adopted filter is false', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, adopted: false })

    expect(result.map((pet) => pet.nome)).toEqual(['Mimi'])
  })

  it('should return all pets when the adopted filter is empty', () => {
    const result = filterPets(pets, { ...EMPTY_FILTERS, adopted: '' })

    expect(result).toEqual(pets)
  })
})
