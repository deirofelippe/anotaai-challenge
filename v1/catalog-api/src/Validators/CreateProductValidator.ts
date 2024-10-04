import { ValidationError } from 'yup';
import { CreateProductUsecaseInput } from '../Usecases/CreateProductUsecase.js';
import { ErrorMessages } from '../types';
import { createProductSchema } from './Schema/CreateProductSchema.js';

export type CreateProductValidatorInput = CreateProductUsecaseInput;

export type CreateProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: CreateProductUsecaseInput;
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
      data = schema.cast(input) as CreateProductUsecaseInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
