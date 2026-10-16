import zod from "zod";

export const petFormSchema = zod.object({
  nome: zod
    .string().min(1, 'Campo obrigatório').default(''),
  especie: zod
    .enum(['cachorro', 'gato'])
    .or(zod.literal(''))
    .default('')
    .refine((value) => value !== '', 'Campo obrigatório'),
  porte: zod
    .enum(['pequeno', 'medio', 'grande'])
    .or(zod.literal(''))
    .default('')
    .refine((value) => value !== '', 'Campo obrigatório'),
  sexo: zod
    .enum(['macho', 'femea'])
    .or(zod.literal(''))
    .default('')
    .refine((value) => value !== '', 'Campo obrigatório'),
  descricao: zod.string().min(1, 'Campo obrigatório').default(''),
  contato: zod
    .string()
    .min(1, 'Campo obrigatório')
    .default('(99) 1 1185-0009')
    .refine((value) => value.replace(/\D/g, '').length === 11, {
      message: 'O número precisa ter 11 dígitos',
    }),
  vacinado: zod.boolean().optional().default(false),
  vermifugado: zod.boolean().optional().default(false),
  castrado: zod.boolean().optional().default(false),
  adotado: zod.boolean().optional().default(false),
})
