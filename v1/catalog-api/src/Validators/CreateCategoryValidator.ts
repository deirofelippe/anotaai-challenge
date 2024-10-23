import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { createCategorySchema } from './Schema/CreateCategorySchema';
import { CreateCategoryUsecaseInput } from '../Usecases/CreateCategoryUsecase';
import { logger } from '../Config/Logger';

export type CreateCategoryValidatorInput = CreateCategoryUsecaseInput;

export type CreateCategoryValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: CreateCategoryUsecaseInput;
};

export class CreateCategoryValidator {
  public validate(
    input: CreateCategoryValidatorInput
  ): CreateCategoryValidatorOutput {
    logger.info({
      context: 'validator',
      data: 'Iniciando o CreateCategoryValidator'
    });
    logger.debug({ context: 'validator', data: { input } });

    const schema = createCategorySchema;

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
        data: 'Erro no CreateCategoryValidator'
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

      data = schema.cast(input) as CreateCategoryUsecaseInput;
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
      data: 'Finalizando o CreateCategoryValidator'
    });

    return {
      errors: [],
      newData: data
    };
  }
}
