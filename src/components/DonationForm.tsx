'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Controller, useForm, useWatch, type FieldError } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { IoLogoWhatsapp } from 'react-icons/io'
import Button from './Button'
import Spinner from './Spinner'
import { createDonation } from '@/lib/api'
import { scrollIntoCenter } from '@/lib/focus'
import { OBSERVATION_LIMIT } from '@/schemas/donation-schema'
import type { DonationFormValues, DonationItem } from '@/types'

const PHONE_FORMAT = '(##) #####-####'

const DONATION_ITEMS: { value: DonationItem; label: string }[] = [
  { value: 'racao', label: 'Ração' },
  { value: 'remedios', label: 'Remédios veterinários' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'calcados', label: 'Calçados' },
  { value: 'livros', label: 'Livros' },
  { value: 'artesanato', label: 'Artesanato' },
  { value: 'plantas', label: 'Plantas' },
  { value: 'outro', label: 'Outro' },
]

const INITIAL_VALUES: DonationFormValues = {
  nome: '',
  telefone: '',
  item: '',
  observacoes: '',
}

function FormError({ id, error }: { id: string; error?: FieldError }) {
  if (!error) return null

  return (
    <p className="formerro" id={id} role="alert">
      {error.message}
    </p>
  )
}

export default function DonationForm() {
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormValues>({ mode: 'all', defaultValues: INITIAL_VALUES })

  const observations = useWatch({ control, name: 'observacoes' })

  async function submit(values: DonationFormValues) {
    setSubmitError(false)

    try {
      // Os nomes dos campos seguem o model `Doacao` da API.
      await createDonation({
        nomeCompleto: values.nome.trim(),
        whatsapp: values.telefone.replace(/\D/g, ''),
        tipos: values.item ? [values.item] : [],
        observacoes: values.observacoes.trim() || undefined,
      })
      setSent(true)
    } catch (error) {
      console.error(error)
      setSubmitError(true)
    }
  }

  function startNewDonation() {
    reset(INITIAL_VALUES)
    setSubmitError(false)
    setSent(false)
  }

  return (
    <div className="pt-4 min-h-screen px-4">
      {sent ? (
        <div
          className="flex flex-col max-w-72 w-full px-5 py-8 my-10 mx-auto gap-3 rounded-2xl bg-(--bg-color2)"
          role="status"
          aria-live="polite"
        >
          <IoLogoWhatsapp className="text-[28pt] text-(--text-color) mx-auto" aria-hidden="true" />

          <h1 className="text-(--text-color) font-extrabold text-[20pt] leading-tight">Obrigado pela sua doação!</h1>

          <p className="text-(--text-color) text-[13pt]">
            Recebemos o seu interesse em doar. Nossa equipe vai entrar em contato pelo WhatsApp informado para combinar a entrega.
          </p>

          <Button name="Cadastrar outra doação" size={15} onClick={startNewDonation} />

          <Link href="/" className="w-full">
            <Button name="Voltar para o início" size={15} />
          </Link>
        </div>
      ) : (
        <>
          <div className="max-w-72 w-full mx-auto">
            <h1 className="text-(--text-color) font-extrabold text-[22pt] leading-tight">Quero Doar</h1>
            <p className="text-(--text-color) text-[13pt] pt-2">
              Preencha os dados abaixo e nossa equipe entrará em contato pelo WhatsApp para combinar a entrega da doação.
            </p>
          </div>

          <form
            onSubmit={(e) => void handleSubmit(submit)(e)}
            noValidate
            className="flex flex-col max-w-72 w-full px-5 pb-6 my-6 mx-auto justify-start rounded-2xl bg-(--bg-color2)"
          >
            <fieldset disabled={isSubmitting} className="flex flex-col">
              <label className="formlabel" htmlFor="nome">
                Nome completo:
              </label>
              <input
                id="nome"
                className="input"
                type="text"
                placeholder="Seu nome completo."
                autoComplete="name"
                onFocus={scrollIntoCenter}
                aria-invalid={errors.nome ? 'true' : 'false'}
                aria-describedby={errors.nome ? 'nome-erro' : undefined}
                {...register('nome', {
                  required: 'Campo obrigatório',
                  validate: (value) => value.trim().length >= 3 || 'Informe pelo menos 3 caracteres',
                })}
              />
              <FormError id="nome-erro" error={errors.nome} />

              <label className="formlabel" htmlFor="telefone">
                Telefone (WhatsApp):
              </label>
              <Controller
                name="telefone"
                control={control}
                rules={{
                  required: 'Campo obrigatório',
                  validate: (value) => {
                    const digits = value.replace(/\D/g, '')
                    return digits.length === 10 || digits.length === 11 || 'Informe o DDD e o número (10 ou 11 dígitos)'
                  },
                }}
                render={({ field: { ref, onChange, ...field } }) => (
                  <PatternFormat
                    {...field}
                    id="telefone"
                    getInputRef={ref}
                    className="input"
                    format={PHONE_FORMAT}
                    placeholder="(XX) 9XXXX-XXXX"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    onFocus={scrollIntoCenter}
                    aria-invalid={errors.telefone ? 'true' : 'false'}
                    aria-describedby={errors.telefone ? 'telefone-erro' : undefined}
                    onValueChange={(values) => onChange(values.value)}
                  />
                )}
              />
              <FormError id="telefone-erro" error={errors.telefone} />

              <label className="formlabel" htmlFor="item">
                O que você deseja doar?
              </label>
              <select
                id="item"
                className="input"
                onFocus={scrollIntoCenter}
                aria-invalid={errors.item ? 'true' : 'false'}
                aria-describedby={errors.item ? 'item-erro' : undefined}
                {...register('item', { required: 'Campo obrigatório' })}
              >
                <option value="">Selecione</option>
                {DONATION_ITEMS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FormError id="item-erro" error={errors.item} />

              <label className="formlabel" htmlFor="observacoes">
                Observações sobre a doação:
              </label>
              <textarea
                id="observacoes"
                className="textarea max-h-32"
                rows={3}
                maxLength={OBSERVATION_LIMIT}
                placeholder="Opcional: quantidade, tamanho, melhor horário para a retirada."
                onFocus={scrollIntoCenter}
                aria-invalid={errors.observacoes ? 'true' : 'false'}
                aria-describedby={errors.observacoes ? 'observacoes-erro' : 'observacoes-contador'}
                {...register('observacoes', {
                  maxLength: { value: OBSERVATION_LIMIT, message: `Máximo de ${OBSERVATION_LIMIT} caracteres` },
                })}
              />
              <p className="text-[12pt] text-(--text-color) pt-1 pr-[5%] text-right" id="observacoes-contador" aria-live="polite">
                {observations.length}/{OBSERVATION_LIMIT} caracteres
              </p>
              <FormError id="observacoes-erro" error={errors.observacoes} />
            </fieldset>

            <br />
            <Button name={isSubmitting ? 'Enviando...' : 'Enviar'} type="submit" size={20} disabled={isSubmitting} />
          </form>

          {isSubmitting && <Spinner className="mx-auto m-4" />}

          {submitError && !isSubmitting && (
            <p className="max-w-72 w-full mx-auto text-base text-[rgb(128,0,0)] font-bold" role="alert">
              Não foi possível enviar sua doação. Verifique sua conexão e tente novamente.
            </p>
          )}
        </>
      )}
    </div>
  )
}
