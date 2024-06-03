import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import {
  ProductRepository,
  UpdateProductRepositoryInput
} from '../Repositories/ProductRepository';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { UpdateProductValidator } from '../Validators/UpdateProductValidator';
import { log } from '../Config/Logger';

export type UpdateProductUsecaseInput = {
  owner: string;
  category: string;
  fields: {
    title?: string;
    description?: string;
  };
};

export type UpdateProductUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type UpdateProductUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  categoryRepository: ProductRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class UpdateProductUsecase {
  constructor(
    private createProductUsecaseConstructor: UpdateProductUsecaseConstructor
  ) {}

  public async execute(
    input: UpdateProductUsecaseInput
  ): Promise<UpdateProductUsecaseOutput> {
    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createProductUsecaseConstructor;

    const validator = new UpdateProductValidator();
    const { newData, errors } = validator.validate(input);

    if (errors.length > 0) {
      return { errors: errors };
    }

    const newProduct: UpdateProductRepositoryInput = {
      owner: newData!.owner,
      category: newData!.category,
      fields: newData!.fields
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: newProduct.owner
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findProductByTitle({
      owner: newProduct.owner,
      title: newProduct.category
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    await categoryRepository.updateProduct(newProduct);
    await newRecordedDataQueue.sendMessage({ owner: newProduct.owner });

    return { errors: [] };
  }
}
