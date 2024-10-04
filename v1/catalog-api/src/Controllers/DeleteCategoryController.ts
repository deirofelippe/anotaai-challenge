import { Request, Response } from 'express';
import {
  DeleteCategoryUsecaseOutput,
  DeleteCategoryUsecase
} from '../Usecases/DeleteCategoryUsecase';

export class DeleteCategoryController {
  constructor(private deleteCategoryUsecase: DeleteCategoryUsecase) {}

  public async execute(req: Request, res: Response) {
    let result: DeleteCategoryUsecaseOutput;

    try {
      result = await this.deleteCategoryUsecase.execute({
        owner: req.query.owner as string,
        category: req.query.title as string
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
    return res.status(204).json({});
  }
}
