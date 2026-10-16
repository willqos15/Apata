import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EMPTY_FILTERS } from '@/lib/filterPets'
import PetFilters from './PetFilters'

describe('PetFilters', () => {
  it('should render selected filter values and options for non-admin users', () => {
    const filters = {
      ...EMPTY_FILTERS,
      search: 'Rex',
      species: 'cachorro' as const,
      sex: 'macho' as const,
      size: 'medio' as const,
      adopted: true,
    }

    render(<PetFilters filters={filters} onChange={vi.fn()} isAdmin={false} />)

    expect(screen.getByPlaceholderText('Buscar por nome.')).toHaveValue('Rex')
    expect(screen.getByLabelText('Espécie')).toHaveValue('cachorro')
    expect(screen.getByLabelText('Sexo')).toHaveValue('macho')
    expect(screen.getByLabelText('Porte')).toHaveValue('medio')
    expect(screen.queryByLabelText('Adotado')).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Cachorro' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Macho' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Médio' })).toBeInTheDocument()
  })

  it('should render the adopted filter and selected values for admin users', () => {
    const filters = {
      ...EMPTY_FILTERS,
      search: 'Mimi',
      species: 'gato' as const,
      sex: 'femea' as const,
      size: 'pequeno' as const,
      adopted: false,
    }

    render(<PetFilters filters={filters} onChange={vi.fn()} isAdmin />)

    expect(screen.getByPlaceholderText('Buscar por nome.')).toHaveValue('Mimi')
    expect(screen.getByLabelText('Espécie')).toHaveValue('gato')
    expect(screen.getByLabelText('Sexo')).toHaveValue('femea')
    expect(screen.getByLabelText('Porte')).toHaveValue('pequeno')
    expect(screen.getByLabelText('Adotado')).toHaveValue('false')
    expect(screen.getByRole('option', { name: 'Sim' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Não' })).toBeInTheDocument()
  })

  it('should notify onChange with updated values for the selected filters', () => {
    const onChange = vi.fn()

    render(<PetFilters filters={EMPTY_FILTERS} onChange={onChange} isAdmin />)

    fireEvent.change(screen.getByLabelText('Espécie'), { target: { value: 'gato' } })

    expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, species: 'gato' })

    fireEvent.change(screen.getByLabelText('Adotado'), { target: { value: 'true' } })

    expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, adopted: true })
  })
})
