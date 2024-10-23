import { Request, Response } from 'express';
import {
  DeleteCategoryUsecaseOutput,
  DeleteCategoryUsecase
} from '../Usecases/DeleteCategoryUsecase';
import { logger } from '../Config/Logger';

export class DeleteCategoryController {
  constructor(private deleteCategoryUsecase: DeleteCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    logger.info({
      context: 'controller',
      data: 'Iniciando o controller de DeleteCategoryController'
    });

    let result: DeleteCategoryUsecaseOutput;

    logger.info({ context: 'controller', data: 'BODY REQUEST' });
    logger.info({ context: 'controller', data: { query: req.query } });

    try {
      result = await this.deleteCategoryUsecase.execute({
        owner: req.query.owner as string,
        category: req.query.title as string
      });

      logger.debug({
        context: 'controller',
        data: { description: 'Output do DeleteCategoryUsecase', output: result }
      });
      logger.info({
        context: 'controller',
        data: 'Finalizando o controller de DeleteCategoryController'
      });
    } catch (error) {
      logger.error({
        context: 'controller',
        data: 'Erro no controller de DeleteCategoryController'
      });
      logger.error({ context: 'controller', data: error });

      return res
        .status(500)
        .json({ errors: [{ message: 'Internal server error' }] });
    }

    if (result.errors.length > 0) {
      return res.status(422).json({ errors: result.errors });
    }
    return res.status(204).json({});
  }
}
