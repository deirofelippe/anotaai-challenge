import { Request, Response } from 'express';
import {
  DeleteProductUsecase,
  DeleteProductUsecaseOutput
} from '../Usecases/DeleteProductUsecase';
import { logger } from '../Config/Logger';

export class DeleteProductController {
  constructor(private deleteProductUsecase: DeleteProductUsecase) {}

  public async execute(req: Request, res: Response) {
    logger.info({
      context: 'controller',
      data: 'Iniciando o controller de DeleteProductController'
    });

    let result: DeleteProductUsecaseOutput;

    logger.info({ context: 'controller', data: 'BODY REQUEST' });
    logger.info({ context: 'controller', data: { query: req.query } });

    try {
      result = await this.deleteProductUsecase.execute({
        owner: req.query.owner as string,
        category: req.query.category as string,
        product: req.query.title as string
      });

      logger.debug({
        context: 'controller',
        data: { description: 'Output do DeleteProductUsecase', output: result }
      });
      logger.info({
        context: 'controller',
        data: 'Finalizando o controller de DeleteProductController'
      });
    } catch (error) {
      logger.error({
        context: 'controller',
        data: 'Erro no controller de DeleteProductController'
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
