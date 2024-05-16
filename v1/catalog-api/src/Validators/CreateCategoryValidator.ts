import { ValidationError } from 'yup';
import { CreateCategoryInput } from '../Usecases/CreateCategoryUsecase';
import { ErrorMessages } from '../types';
import { createCategorySchema } from './Schema/CreateCategorySchema';

export type CreateCategoryValidatorInput = CreateCategoryInput;

export type CreateCategoryValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: CreateCategoryInput;
};

export class CreateCategoryValidator {
  public validate(
    input: CreateCategoryValidatorInput
  ): CreateCategoryValidatorOutput {
    const schema = createCategorySchema;

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
      data = schema.cast(input) as CreateCategoryInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
