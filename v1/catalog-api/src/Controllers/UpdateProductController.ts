import { Request, Response } from 'express';
import {
  UpdateProductUsecaseInput,
  UpdateProductUsecaseOutput,
  UpdateProductUsecase
} from '../Usecases/UpdateProductUsecase';

export class UpdateProductController {
  constructor(private createProductUsecase: UpdateProductUsecase) {}

  public async execute(req: Request, res: Response) {
    const body = req.body as UpdateProductUsecaseInput;

    let result: UpdateProductUsecaseOutput;
    try {
      result = await this.createProductUsecase.execute({
        owner: body.owner,
        category: body.category,
        product: req.params.title,
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
