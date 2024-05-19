import { number, object, string } from 'yup';

export const createProductSchema = object({
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
  title: string()
    .required('Title deve ser preenchido')
    .typeError('Title deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Title deve ter no mínimo ${min} caracter')
    .max(128, 'Title deve ter no máximo ${max} caracteres'),
  description: string()
    .notRequired()
    .typeError('Category deve conter caracteres')
    .transform((value: string) => value.trim())
    .max(512, 'Description deve ter no máximo ${max} caracteres')
    .default(''),
  price: number()
    .required('Price deve ser preenchido')
    .typeError('Price deve conter números')
    .min(10, 'Price deve ter o valor mínimo de ${min}')
    .max(100000, 'Price deve ter o valor máximo de ${max}')
});
