import { Request, Response } from 'express';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
  CreateCategoryUsecase
} from '../Usecases/CreateCategoryUsecase';

export class CreateCategoryController {
  constructor(private createCategoryUsecase: CreateCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    const body = req.body as CreateCategoryInput;

    let result: CreateCategoryOutput;
    try {
      result = await this.createCategoryUsecase.execute({
        owner: body.owner,
        title: body.title,
        description: body.description
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
