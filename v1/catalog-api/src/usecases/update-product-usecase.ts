import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import {
  ProductRepository,
  UpdateProductRepositoryInput
} from '../repositories/product-repository';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../repositories/owner-repository';
import { UpdateProductValidator } from '../validators/update-product-validator';
import { CategoryRepository } from '../repositories/category-repository';
import { logger } from '../config/logger';

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
    logger.info({
      context: 'usecase',
      data: 'Iniciando o UpdateProductUsecase'
    });

    const {
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue,
      productRepository
    } = this.createProductUsecaseConstructor;

    const validator = new UpdateProductValidator();
    const { newData, errors } = validator.validate(input);
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da validação', errors }
    });

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
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da busca por owner', ownerFound }
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: productToUpdate.owner,
      title: productToUpdate.category
    });
    logger.debug({
      context: 'usecase',
      data: {
        description: 'Output da busca por category pelo title',
        ownerFound
      }
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    const productFound = await productRepository.findProductByTitle({
      owner: productToUpdate.owner,
      category: productToUpdate.category,
      title: productToUpdate.product
    });
    logger.debug({
      context: 'usecase',
      data: {
        description: 'Output da busca por product pelo title',
        ownerFound
      }
    });

    if (productFound.length <= 0) {
      return { errors: [{ message: 'Produto não existe' }] };
    }

    await productRepository.updateProduct(productToUpdate);
    await newRecordedDataQueue.sendMessage({ owner: productToUpdate.owner });

    logger.info({
      context: 'usecase',
      data: 'Finalizando o UpdateProductUsecase'
    });

    return { errors: [] };
  }
}
