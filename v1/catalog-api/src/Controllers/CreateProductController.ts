import { Request, Response } from 'express';
import {
  CreateProductUsecaseInput,
  CreateProductUsecaseOutput,
  CreateProductUsecase
} from '../Usecases/CreateProductUsecase.js';

export class CreateProductController {
  constructor(private createProductUsecase: CreateProductUsecase) {}

  public async execute(req: Request, res: Response) {
    const body = req.body as CreateProductUsecaseInput;

    let result: CreateProductUsecaseOutput;
    try {
      result = await this.createProductUsecase.execute({
        owner: body.owner,
        category: body.category,
        title: body.title,
        description: body.description,
        price: body.price
      });
    } catch (error) {
      console.log(error);

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
