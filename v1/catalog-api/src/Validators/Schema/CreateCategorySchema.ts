import { object, string } from 'yup';

export const createCategorySchema = object({
  owner: string()
    .required('Owner deve ser preenchido')
    .typeError('Owner deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Owner deve ter no mínimo ${min} caracter')
    .max(26, 'Owner deve ter no máximo ${max} caracteres'),
  title: string()
    .required('Title deve ser preenchido')
    .typeError('Title deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Title deve ter no mínimo ${min} caracter')
    .max(128, 'Title deve ter no máximo ${max} caracteres'),
  description: string()
    .notRequired()
    .typeError('Description deve conter caracteres')
    .transform((value: string) => value.trim())
    .max(512, 'Description deve ter no máximo ${max} caracteres')
    .default('')
});
