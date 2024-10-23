import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { DeleteCategoryUsecaseInput } from '../Usecases/DeleteCategoryUsecase';
import { deleteCategorySchema } from './Schema/DeleteCategorySchema';
import { logger } from '../Config/Logger';

export type DeleteCategoryValidatorInput = DeleteCategoryUsecaseInput;

export type DeleteCategoryValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: DeleteCategoryUsecaseInput;
};

export class DeleteCategoryValidator {
  public validate(
    input: DeleteCategoryValidatorInput
  ): DeleteCategoryValidatorOutput {
    logger.info({
      context: 'validator',
      data: 'Iniciando o DeleteCategoryValidator'
    });
    logger.debug({ context: 'validator', data: { input } });

    const schema = deleteCategorySchema;

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
        data: 'Erro no DeleteCategoryValidator'
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

      data = schema.cast(input) as DeleteCategoryUsecaseInput;
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
      data: 'Finalizando o DeleteCategoryValidator'
    });

    return {
      errors: [],
      newData: data
    };
  }
}
