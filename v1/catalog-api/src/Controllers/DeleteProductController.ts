import { Request, Response } from 'express';
import {
  DeleteProductUsecase,
  DeleteProductUsecaseOutput
} from '../Usecases/DeleteProductUsecase';

export class DeleteProductController {
  constructor(private deleteProductUsecase: DeleteProductUsecase) {}

  public async execute(req: Request, res: Response) {
    let result: DeleteProductUsecaseOutput;

    try {
      result = await this.deleteProductUsecase.execute({
        owner: req.query.owner as string,
        category: req.query.category as string,
        product: req.query.title as string
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
