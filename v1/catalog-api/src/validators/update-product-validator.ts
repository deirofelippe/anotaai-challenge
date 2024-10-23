import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { UpdateProductUsecaseInput } from '../usecases/update-product-usecase';
import { updateProductSchema } from './schema/update-product-schema';
import { logger } from '../config/logger';

export type UpdateProductValidatorInput = UpdateProductUsecaseInput;

export type UpdateProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: UpdateProductUsecaseInput;
};

export class UpdateProductValidator {
  public validate(
    input: UpdateProductValidatorInput
  ): UpdateProductValidatorOutput {
    logger.info({
      context: 'validator',
      data: 'Iniciando o UpdateProductValidator'
    });
    logger.debug({ context: 'validator', data: { input } });

    const schema = updateProductSchema;

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
        data: 'Erro no UpdateProductValidator'
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

      data = schema.cast(input) as UpdateProductUsecaseInput;
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
      data: 'Finalizando o UpdateProductValidator'
    });

    return {
      errors: [],
      newData: data
    };
  }
}
