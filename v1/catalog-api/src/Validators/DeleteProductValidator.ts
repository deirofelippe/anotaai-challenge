import { ValidationError } from 'yup';
import { ErrorMessages } from '../types';
import { DeleteProductUsecaseInput } from '../Usecases/DeleteProductUsecase';
import { deleteProductSchema } from './Schema/DeleteProductSchema';
import { logger } from '../Config/Logger';

export type DeleteProductValidatorInput = DeleteProductUsecaseInput;

export type DeleteProductValidatorOutput = {
  errors: ErrorMessages['errors'];
  newData?: DeleteProductUsecaseInput;
};

export class DeleteProductValidator {
  public validate(
    input: DeleteProductValidatorInput
  ): DeleteProductValidatorOutput {
    logger.info({
      context: 'validator',
      data: 'Iniciando o DeleteProductValidator'
    });
    logger.debug({ context: 'validator', data: { input } });

    const schema = deleteProductSchema;

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
        data: 'Erro no DeleteProductValidator'
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

      data = schema.cast(input) as DeleteProductUsecaseInput;
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
      data: 'Finalizando o DeleteProductValidator'
    });

    return {
      errors: [],
      newData: data
    };
  }
}
