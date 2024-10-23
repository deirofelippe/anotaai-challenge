import { Request, Response } from 'express';
import {
  UpdateProductUsecaseInput,
  UpdateProductUsecaseOutput,
  UpdateProductUsecase
} from '../usecases/update-product-usecase';
import { logger } from '../config/logger';

export class UpdateProductController {
  constructor(private updateProductUsecase: UpdateProductUsecase) {}

  public async execute(req: Request, res: Response) {
    logger.info({
      context: 'controller',
      data: 'Iniciando o controller de UpdateProductController'
    });

    const body = req.body as UpdateProductUsecaseInput;

    logger.info({ context: 'controller', data: 'BODY REQUEST' });
    logger.info({
      context: 'controller',
      data: {
        body,
        params: req.params
      }
    });

    let result: UpdateProductUsecaseOutput;
    try {
      result = await this.updateProductUsecase.execute({
        owner: body.owner,
        category: body.category,
        product: req.params.title,
        fields: body.fields
      });

      logger.debug({
        context: 'controller',
        data: { description: 'Output do UpdateProductUsecase', output: result }
      });
      logger.info({
        context: 'controller',
        data: 'Finalizando o controller de UpdateProductController'
      });
    } catch (error) {
      logger.error({
        context: 'controller',
        data: 'Erro no controller de UpdateProductController'
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
