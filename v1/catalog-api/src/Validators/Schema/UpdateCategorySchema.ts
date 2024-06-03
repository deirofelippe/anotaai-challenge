import { Maybe, object, string } from 'yup';

const allFieldsIsEmpty = (fields: {
  title?: Maybe<string | undefined>;
  description?: Maybe<string | undefined>;
}) => {
  const pass = !Object.entries(fields).every(([key, value]) => value === '');

  return pass;
};

export const updateCategorySchema = object({
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
  fields: object({
    title: string()
      .notRequired()
      .typeError('Title deve conter caracteres')
      .transform((value: string) => value.trim())
      .min(1, 'Title deve ter no mínimo ${min} caracter')
      .max(128, 'Title deve ter no máximo ${max} caracteres'),
    description: string()
      .notRequired()
      .typeError('Description deve conter caracteres')
      .transform((value: string) => value.trim())
      .max(512, 'Description deve ter no máximo ${max} caracteres')
  }).test({
    test: allFieldsIsEmpty,
    message: 'Algum campo deve ser preenchido'
  })
});
