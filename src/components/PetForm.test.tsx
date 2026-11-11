import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PetForm from './PetForm'
import { createPet } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  createPet: vi.fn(),
}))

vi.mock('@/lib/focus', () => ({
  scrollIntoCenter: vi.fn(),
}))

vi.mock('./ImageCropper', () => ({
  default: ({ open, onConfirm }: { open: boolean; onConfirm: (file: File) => void }) =>
    open ? (
      <div data-testid="mock-cropper">
        <button
          type="button"
          onClick={() => onConfirm(new File(['dummy'], 'test.jpg', { type: 'image/jpeg' }))}
        >
          Confirmar Crop
        </button>
      </div>
    ) : null,
}))

const mockedCreatePet = vi.mocked(createPet)

describe('PetForm - Faixa Etária', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve exibir o campo de faixa etária com as opções Filhote, Adulto e Idoso', () => {
    render(<PetForm />)

    const selects = screen.getAllByRole('combobox')
    const faixaEtariaSelect = selects.find((select) =>
      select.previousElementSibling?.textContent?.includes('Faixa Etária'),
    )

    expect(faixaEtariaSelect).toBeDefined()

    const options = Array.from(faixaEtariaSelect!.querySelectorAll('option')).map(
      (opt) => opt.value,
    )
    expect(options).toEqual(['', 'Filhote', 'Adulto', 'Idoso'])
  })

  it('permite selecionar uma das três opções antes de cadastrar o animal', async () => {
    render(<PetForm />)

    const selects = screen.getAllByRole('combobox')
    const faixaEtariaSelect = selects.find((select) =>
      select.previousElementSibling?.textContent?.includes('Faixa Etária'),
    ) as HTMLSelectElement

    fireEvent.change(faixaEtariaSelect, { target: { value: 'Filhote' } })
    expect(faixaEtariaSelect.value).toBe('Filhote')

    fireEvent.change(faixaEtariaSelect, { target: { value: 'Adulto' } })
    expect(faixaEtariaSelect.value).toBe('Adulto')

    fireEvent.change(faixaEtariaSelect, { target: { value: 'Idoso' } })
    expect(faixaEtariaSelect.value).toBe('Idoso')
  })

  it('exibe erro de validação se a faixa etária não for selecionada ao submeter', async () => {
    const user = userEvent.setup()
    render(<PetForm />)

    const submitBtn = screen.getByRole('button', { name: /salvar/i })
    await user.click(submitBtn)

    await waitFor(() => {
      const errorMessages = screen.getAllByText('Campo obrigatório')
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })

  it('envia a faixa etária selecionada no FormData ao cadastrar o animal', async () => {
    mockedCreatePet.mockResolvedValueOnce({
      id: 'pet-123',
      nome: 'Bidu',
      foto: null,
      especie: 'cachorro',
      porte: 'medio',
      sexo: 'macho',
      faixa_etaria: 'Filhote',
      descricao: 'Cachorrinho brincalhão',
      contato: '93991185009',
      adotado: false,
      vacinado: false,
      vermifugado: false,
      castrado: false,
    })

    const user = userEvent.setup()
    render(<PetForm />)

    // Preenche nome
    await user.type(screen.getByPlaceholderText('Nome do animal.'), 'Bidu')

    // Simula upload de imagem
    const file = new File(['content'], 'bidu.png', { type: 'image/png' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(fileInput, file)

    // Confirma crop
    const confirmCropBtn = await screen.findByRole('button', { name: /confirmar crop/i })
    await user.click(confirmCropBtn)

    // Preenche selects
    const selects = screen.getAllByRole('combobox')
    const especieSelect = selects.find((s) => s.previousElementSibling?.textContent?.includes('Espécie'))!
    const porteSelect = selects.find((s) => s.previousElementSibling?.textContent?.includes('Porte'))!
    const sexoSelect = selects.find((s) => s.previousElementSibling?.textContent?.includes('Sexo'))!
    const faixaEtariaSelect = selects.find((s) => s.previousElementSibling?.textContent?.includes('Faixa Etária'))!

    await user.selectOptions(especieSelect, 'cachorro')
    await user.selectOptions(porteSelect, 'medio')
    await user.selectOptions(sexoSelect, 'macho')
    await user.selectOptions(faixaEtariaSelect, 'Filhote')

    // Preenche descrição
    await user.type(screen.getByPlaceholderText(/idade, castrado/i), 'Cachorrinho brincalhão')

    // Submete
    const submitBtn = screen.getByRole('button', { name: /salvar/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockedCreatePet).toHaveBeenCalledTimes(1)
    })

    const passedFormData = mockedCreatePet.mock.calls[0][0] as FormData
    expect(passedFormData.get('faixa_etaria')).toBe('Filhote')
    expect(passedFormData.get('nome')).toBe('Bidu')
    expect(passedFormData.get('especie')).toBe('cachorro')
    expect(passedFormData.get('porte')).toBe('medio')
    expect(passedFormData.get('sexo')).toBe('macho')
    expect(passedFormData.get('descricao')).toBe('Cachorrinho brincalhão')
  })
})
