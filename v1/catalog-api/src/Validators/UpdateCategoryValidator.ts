import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { UpdateCategoryUsecaseInput } from '../Usecases/UpdateCategoryUsecase.js';
import { updateCategorySchema } from './Schema/UpdateCategorySchema.js';

export type UpdateCategoryValidatorInput = UpdateCategoryUsecaseInput;

export type UpdateCategoryValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: UpdateCategoryUsecaseInput;
};

export class UpdateCategoryValidator {
  public validate(
    input: UpdateCategoryValidatorInput
  ): UpdateCategoryValidatorOutput {
    const schema = updateCategorySchema;

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
      data = schema.cast(input) as UpdateCategoryUsecaseInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
