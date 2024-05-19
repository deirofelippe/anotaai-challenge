import { ValidationError } from 'yup';
import { CreateProductInput } from '../Usecases/CreateProductUsecase';
import { ErrorMessages } from '../types';
import { createProductSchema } from './Schema/CreateProductSchema';

export type CreateProductValidatorInput = CreateProductInput;

export type CreateProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: CreateProductInput;
};

export class CreateProductValidator {
  public validate(
    input: CreateProductValidatorInput
  ): CreateProductValidatorOutput {
    const schema = createProductSchema;

    try {
      schema.validateSync(input, {
        abortEarly: false
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages: ErrorMessages['errors'] = error.errors.map((item) => ({
          message: item
        }));

        return { errors: messages };
      }

      throw error;
    }

    let data;
    try {
      data = schema.cast(input) as CreateProductInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
