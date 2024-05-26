import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { DeleteCategoryUsecaseInput } from '../Usecases/DeleteCategoryUsecase';
import { deleteCategorySchema } from './Schema/DeleteCategorySchema';

export type DeleteCategoryValidatorInput = DeleteCategoryUsecaseInput;

export type DeleteCategoryValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: DeleteCategoryUsecaseInput;
};

export class DeleteCategoryValidator {
  public validate(
    input: DeleteCategoryValidatorInput
  ): DeleteCategoryValidatorOutput {
    const schema = deleteCategorySchema;

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
      data = schema.cast(input) as DeleteCategoryUsecaseInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
