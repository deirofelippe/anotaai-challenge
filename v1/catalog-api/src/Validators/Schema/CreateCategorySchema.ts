import { object, string } from 'yup';

export const createCategorySchema = object({
  owner: string()
    .required('Title deve ser preenchido')
    .transform((value: string) => value.trim())
    .min(1, 'Title deve ter no mínimo ${min} caracter')
    .max(26, 'Title deve ter no máximo ${max} caracteres'),
  title: string()
    .required('Title deve ser preenchido')
    .transform((value: string) => value.trim())
    .min(1, 'Title deve ter no mínimo ${min} caracter')
    .max(128, 'Title deve ter no máximo ${max} caracteres'),
  description: string()
    .nullable()
    .transform((value: string) => value.trim())
    .max(512, 'Description deve ter no máximo ${max} caracteres')
    .default('')
});
