import { object, string } from 'yup';

export const deleteCategorySchema = object({
  owner: string()
    .required('Owner deve ser preenchido')
    .typeError('Owner deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Owner deve ter no mínimo ${min} caracter')
    .max(26, 'Owner deve ter no máximo ${max} caracteres'),
  category: string()
    .required('Category deve ser preenchido')
    .typeError('Category deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Category deve ter no mínimo ${min} caracter')
    .max(128, 'Category deve ter no máximo ${max} caracteres')
});
