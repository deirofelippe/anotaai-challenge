import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { UpdateCategoryUsecaseInput } from '../usecases/update-category-usecase';
import { updateCategorySchema } from './schema/update-category-schema';
import { logger } from '../config/logger';

export type UpdateCategoryValidatorInput = UpdateCategoryUsecaseInput;

export type UpdateCategoryValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: UpdateCategoryUsecaseInput;
};

export class UpdateCategoryValidator {
  public validate(
    input: UpdateCategoryValidatorInput
  ): UpdateCategoryValidatorOutput {
    logger.info({
      context: 'validator',
      data: 'Iniciando o UpdateCategoryValidator'
    });
    logger.debug({ context: 'validator', data: { input } });

    const schema = updateCategorySchema;

    try {
      logger.info({
        context: 'validator',
        data: 'Fazendo a validação do input'
      });

      schema.validateSync(input, {
        abortEarly: false
      });
    } catch (error) {
      logger.error({
        context: 'validator',
        data: 'Erro no UpdateCategoryValidator'
      });
      logger.error({ context: 'validator', data: error });

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
      logger.info({ context: 'validator', data: 'Fazendo o cast do input' });

      data = schema.cast(input) as UpdateCategoryUsecaseInput;
    } catch (error) {
      logger.error({
        context: 'validator',
        data: 'Error ao fazer cast do input'
      });
      logger.error({ context: 'validator', data: error });

      throw error;
    }

    logger.info({
      context: 'validator',
      data: 'Finalizando o UpdateCategoryValidator'
    });

    return {
      errors: [],
      newData: data
    };
  }
}
