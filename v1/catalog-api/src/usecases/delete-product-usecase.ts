import { logger } from '../config/logger';
import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import { CategoryRepository } from '../repositories/category-repository';
import { OwnerRepository } from '../repositories/owner-repository';
import { ProductRepository } from '../repositories/product-repository';
import { DeleteProductValidator } from '../validators/delete-product-validator';
import { ErrorMessages } from '../types';

export type DeleteProductUsecaseInput = {
  product: string;
  category: string;
  owner: string;
};

export type DeleteProductUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type DeleteProductUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class DeleteProductUsecase {
  constructor(
    private deleteProductUsecaseConstructor: DeleteProductUsecaseConstructor
  ) {}

  public async execute(
    input: DeleteProductUsecaseInput
  ): Promise<DeleteProductUsecaseOutput> {
    logger.info({
      context: 'usecase',
      data: 'Iniciando o DeleteProductUsecase'
    });

    const {
      productRepository,
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue
    } = this.deleteProductUsecaseConstructor;

    const validator = new DeleteProductValidator();
    const { newData, errors } = validator.validate(input);
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da validação', errors }
    });

    if (errors.length > 0) {
      return { errors: errors };
    }

    const product: DeleteProductUsecaseInput = {
      owner: newData!.owner,
      category: newData!.category,
      product: newData!.product
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: product.owner
    });
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da busca por owner', ownerFound }
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: product.owner,
      title: product.category
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
      owner: product.owner,
      category: product.category,
      title: product.product
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

    await productRepository.deleteProduct(product);
    await newRecordedDataQueue.sendMessage({ owner: product.owner });

    logger.info({
      context: 'usecase',
      data: 'Finalizando o DeleteProductUsecase'
    });

    return { errors: [] };
  }
}
