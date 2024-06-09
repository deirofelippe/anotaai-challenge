import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import {
  ProductRepository,
  UpdateProductRepositoryInput
} from '../Repositories/ProductRepository';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { UpdateProductValidator } from '../Validators/UpdateProductValidator';
import { CategoryRepository } from '../Repositories/CategoryRepository';

export type UpdateProductUsecaseInput = {
  owner: string;
  product: string;
  category: string;
  fields: {
    title?: string;
    description?: string;
    price?: number;
  };
};

export type UpdateProductUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type UpdateProductUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class UpdateProductUsecase {
  constructor(
    private createProductUsecaseConstructor: UpdateProductUsecaseConstructor
  ) {}

  public async execute(
    input: UpdateProductUsecaseInput
  ): Promise<UpdateProductUsecaseOutput> {
    const {
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue,
      productRepository
    } = this.createProductUsecaseConstructor;

    const validator = new UpdateProductValidator();
    const { newData, errors } = validator.validate(input);

    if (errors.length > 0) {
      return { errors: errors };
    }

    const productToUpdate: UpdateProductRepositoryInput = {
      owner: newData!.owner,
      category: newData!.category,
      product: newData!.product,
      fields: newData!.fields
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: productToUpdate.owner
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: productToUpdate.owner,
      title: productToUpdate.category
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    const productFound = await productRepository.findProductByTitle({
      owner: productToUpdate.owner,
      category: productToUpdate.category,
      title: productToUpdate.product
    });

    if (productFound.length <= 0) {
      return { errors: [{ message: 'Produto não existe' }] };
    }

    await productRepository.updateProduct(productToUpdate);
    await newRecordedDataQueue.sendMessage({ owner: productToUpdate.owner });

    return { errors: [] };
  }
}
