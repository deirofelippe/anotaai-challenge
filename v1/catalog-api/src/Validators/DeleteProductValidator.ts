import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { DeleteProductUsecaseInput } from '../Usecases/DeleteProductUsecase.js';
import { deleteProductSchema } from './Schema/DeleteProductSchema.js';

export type DeleteProductValidatorInput = DeleteProductUsecaseInput;

export type DeleteProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: DeleteProductUsecaseInput;
};

export class DeleteProductValidator {
  public validate(
    input: DeleteProductValidatorInput
  ): DeleteProductValidatorOutput {
    const schema = deleteProductSchema;

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
      data = schema.cast(input) as DeleteProductUsecaseInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
