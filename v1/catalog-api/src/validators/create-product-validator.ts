import { ValidationError } from 'yup';
import { CreateProductUsecaseInput } from '../usecases/create-product-usecase';
import { ErrorMessages } from '../types';
import { createProductSchema } from './schema/create-product-schema';
import { logger } from '../config/logger';

export type CreateProductValidatorInput = CreateProductUsecaseInput;

export type CreateProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: CreateProductUsecaseInput;
};

export class CreateProductValidator {
  public validate(
    input: CreateProductValidatorInput
  ): CreateProductValidatorOutput {
    logger.info({
      context: 'validator',
      data: 'Iniciando o CreateProductValidator'
    });
    logger.debug({ context: 'validator', data: { input } });

    const schema = createProductSchema;

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
        data: 'Erro no CreateProductValidator'
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

      data = schema.cast(input) as CreateProductUsecaseInput;
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
      data: 'Finalizando o CreateProductValidator'
    });

    return {
      errors: [],
      newData: data
    };
  }
}
