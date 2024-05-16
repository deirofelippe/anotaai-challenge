import { Request, Response } from 'express';
import {
  CreateCategoryInput,
  CreateCategoryUsecase
} from '../Usecases/CreateCategoryUsecase';

export class CreateCategoryController {
  constructor(private createCategoryUsecase: CreateCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    const body = req.body as CreateCategoryInput;

    const result = await this.createCategoryUsecase.execute({
      owner: body.owner,
      title: body.title,
      description: body.description
    });

    if (result.errors.length > 0) {
      return res.status(422).json({ errors: result.errors });
    }
    return res.status(201).json({});
  }
}
