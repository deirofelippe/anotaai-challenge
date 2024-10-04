import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { UpdateProductUsecaseInput } from '../Usecases/UpdateProductUsecase';
import { updateProductSchema } from './Schema/UpdateProductSchema';

export type UpdateProductValidatorInput = UpdateProductUsecaseInput;

export type UpdateProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: UpdateProductUsecaseInput;
};

export class UpdateProductValidator {
  public validate(
    input: UpdateProductValidatorInput
  ): UpdateProductValidatorOutput {
    const schema = updateProductSchema;

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
      data = schema.cast(input) as UpdateProductUsecaseInput;
    } catch (error) {
      throw error;
    }

    return {
      errors: [],
      newData: data
    };
  }
}
