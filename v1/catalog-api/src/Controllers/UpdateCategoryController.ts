import { Request, Response } from 'express';
import {
  UpdateCategoryUsecaseInput,
  UpdateCategoryUsecaseOutput,
  UpdateCategoryUsecase
} from '../Usecases/UpdateCategoryUsecase';
import { logger } from '../Config/Logger';

export class UpdateCategoryController {
  constructor(private updateCategoryUsecase: UpdateCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    logger.info({
      context: 'controller',
      data: 'Iniciando o controller de UpdateCategoryController'
    });

    const body = req.body as UpdateCategoryUsecaseInput;

    logger.info({ context: 'controller', data: 'BODY REQUEST' });
    logger.info({
      context: 'controller',
      data: {
        body,
        params: req.params
      }
    });

    let result: UpdateCategoryUsecaseOutput;
    try {
      result = await this.updateCategoryUsecase.execute({
        owner: body.owner,
        category: req.params.title as string,
        fields: body.fields
      });

      logger.debug({
        context: 'controller',
        data: { description: 'Output do UpdateCategoryUsecase', output: result }
      });
      logger.info({
        context: 'controller',
        data: 'Finalizando o controller de UpdateCategoryController'
      });
    } catch (error) {
      logger.error({
        context: 'controller',
        data: 'Erro no controller de UpdateCategoryController'
      });
      logger.error({ context: 'controller', data: error });

      return res
        .status(500)
        .json({ errors: [{ message: 'Internal server error' }] });
    }

    if (result.errors.length > 0) {
      return res.status(422).json({ errors: result.errors });
    }
    return res.status(200).json({});
  }
}
