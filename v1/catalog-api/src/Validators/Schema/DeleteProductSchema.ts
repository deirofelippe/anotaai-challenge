import { number, object, string } from 'yup';

export const deleteProductSchema = object({
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
    .max(128, 'Category deve ter no máximo ${max} caracteres'),
  product: string()
    .required('Product deve ser preenchido')
    .typeError('Product deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Product deve ter no mínimo ${min} caracter')
    .max(128, 'Product deve ter no máximo ${max} caracteres')
});
