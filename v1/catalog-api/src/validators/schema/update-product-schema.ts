import { Maybe, number, object, string } from 'yup';

const allFieldsIsEmpty = (fields: {
  title?: Maybe<string | undefined>;
  description?: Maybe<string | undefined>;
  price?: Maybe<number | undefined>;
}) => {
  const pass = !Object.entries(fields).every(([key, value]) => value === '');

  return pass;
};

export const updateProductSchema = object({
  owner: string()
    .required('Owner deve ser preenchido')
    .typeError('Owner deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Owner deve ter no mínimo ${min} caracter')
    .max(26, 'Owner deve ter no máximo ${max} caracteres'),
  category: string()
    .required('Product deve ser preenchido')
    .typeError('Product deve conter caracteres')
    .transform((value: string) => value.trim())
    .min(1, 'Product deve ter no mínimo ${min} caracter')
    .max(128, 'Product deve ter no máximo ${max} caracteres'),
  fields: object({
    title: string()
      .notRequired()
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
      .notRequired()
      .typeError('Price deve conter números')
      .min(10, 'Price deve ter o valor mínimo de ${min}')
      .max(100000, 'Price deve ter o valor máximo de ${max}')
  }).test({
    test: allFieldsIsEmpty,
    message: 'Algum campo deve ser preenchido'
  })
});
