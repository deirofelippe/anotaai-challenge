import { Request, Response } from 'express';
import {
  CreateProductUsecaseInput,
  CreateProductUsecaseOutput,
  CreateProductUsecase
} from '../usecases/create-product-usecase';
import { logger } from '../config/logger';

export class CreateProductController {
  constructor(private createProductUsecase: CreateProductUsecase) {}

  public async execute(req: Request, res: Response) {
    logger.info({
      context: 'controller',
      data: 'Iniciando o controller de CreateProductController'
    });

    const body = req.body as CreateProductUsecaseInput;

    logger.info({ context: 'controller', data: 'BODY REQUEST' });
    logger.info({ context: 'controller', data: { body } });

    let result: CreateProductUsecaseOutput;
    try {
      result = await this.createProductUsecase.execute({
        owner: body.owner,
        category: body.category,
        title: body.title,
        description: body.description,
        price: body.price
      });

      logger.debug({
        context: 'controller',
        data: { description: 'Output do CreateProductUsecase', output: result }
      });
      logger.info({
        context: 'controller',
        data: 'Finalizando o controller de CreateProductController'
      });
    } catch (error) {
      logger.error({
        context: 'controller',
        data: 'Erro no controller de CreateCategory'
      });
      logger.error({ context: 'controller', data: error });

      return res
        .status(500)
        .json({ errors: [{ message: 'Internal server error' }] });
    }

    if (result.errors.length > 0) {
      return res.status(422).json({ errors: result.errors });
    }

    return res.status(201).json({});
  }
}
