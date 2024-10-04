import { Request, Response } from 'express';
import {
  UpdateCategoryUsecaseInput,
  UpdateCategoryUsecaseOutput,
  UpdateCategoryUsecase
} from '../Usecases/UpdateCategoryUsecase.js';

export class UpdateCategoryController {
  constructor(private createCategoryUsecase: UpdateCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    const body = req.body as UpdateCategoryUsecaseInput;

    let result: UpdateCategoryUsecaseOutput;
    try {
      result = await this.createCategoryUsecase.execute({
        owner: body.owner,
        category: req.params.title as string,
        fields: body.fields
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
    return res.status(200).json({});
  }
}
