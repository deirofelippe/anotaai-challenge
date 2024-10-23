import { Request, Response } from 'express';
import {
  CreateCategoryUsecaseInput,
  CreateCategoryUsecaseOutput,
  CreateCategoryUsecase
} from '../Usecases/CreateCategoryUsecase';
import { logger } from '../Config/Logger';

export class CreateCategoryController {
  constructor(private createCategoryUsecase: CreateCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    logger.info({
      context: 'controller',
      data: 'Iniciando o controller de CreateCategory'
    });

    const body = req.body as CreateCategoryUsecaseInput;

    logger.info({ context: 'controller', data: 'BODY REQUEST' });
    logger.info({ context: 'controller', data: { body } });

    let result: CreateCategoryUsecaseOutput;
    try {
      result = await this.createCategoryUsecase.execute({
        owner: body.owner,
        title: body.title,
        description: body.description
      });

      logger.debug({
        context: 'controller',
        data: { description: 'Output do CreateCategoryUsecase', output: result }
      });
      logger.info({
        context: 'controller',
        data: 'Finalizando o controller de CreateCategory'
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
