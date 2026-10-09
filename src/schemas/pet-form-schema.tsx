import z from "zod";

export const petFormSchema = z.object({
  nome: z.string().min(1, 'Campo obrigatório'),
  especie: z.enum(['cachorro', 'gato']).or(z.literal('')).refine((value) => value !== '', 'Campo obrigatório'),
  porte: z.enum(['pequeno', 'medio', 'grande']).or(z.literal('')).refine((value) => value !== '', 'Campo obrigatório'),
  sexo: z.enum(['macho', 'femea']).or(z.literal('')).refine((value) => value !== '', 'Campo obrigatório'),
  descricao: z.string().min(1, 'Campo obrigatório'),
  contato: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine((value) => value.replace(/\D/g, '').length === 11, {
      message: 'O número precisa ter 11 dígitos',
    }),
  vacinado:z.boolean('Campo obrigatório'),
  vermifugado:z.boolean('Campo obrigatório'),
  castrado:z.boolean('Campo obrigatório')
})
