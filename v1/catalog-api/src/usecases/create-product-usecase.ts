import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import { CreateProductValidator } from '../validators/create-product-validator';
import { ErrorMessages } from '../types';
import { ProductRepository } from '../repositories/product-repository';
import { CategoryRepository } from '../repositories/category-repository';
import { OwnerRepository } from '../repositories/owner-repository';
import { logger } from '../config/logger';

export type Product = {
  owner: string;
  category: string;
  title: string;
  description?: string;
  price: number;
};

export type CreateProductUsecaseInput = Product;

export type CreateProductUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type CreateProductUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class CreateProductUsecase {
  constructor(
    private createProductUsecaseConstructor: CreateProductUsecaseConstructor
  ) {}

  public async execute(
    input: CreateProductUsecaseInput
  ): Promise<CreateProductUsecaseOutput> {
    logger.info({
      context: 'usecase',
      data: 'Iniciando o CreateProductUsecase'
    });

    const {
      productRepository,
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue
    } = this.createProductUsecaseConstructor;

    const validator = new CreateProductValidator();
    const { newData, errors } = validator.validate(input);
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da validação', errors }
    });

    if (errors.length > 0) {
      return { errors: errors };
    }

    const product: Product = {
      owner: newData!.owner,
      category: newData!.category,
      title: newData!.title,
      description: newData?.description,
      price: newData!.price
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
        categoryFound
      }
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    const productFound = await productRepository.findProductByTitle({
      owner: product.owner,
      category: product.category,
      title: product.title
    });
    logger.debug({
      context: 'usecase',
      data: {
        description: 'Output da busca por product pelo title',
        categoryFound
      }
    });

    if (productFound.length > 0) {
      return { errors: [{ message: 'Produto já cadastrado' }] };
    }

    await productRepository.createProduct(product);
    await newRecordedDataQueue.sendMessage({ owner: product.owner });

    logger.info({
      context: 'usecase',
      data: 'Finalizando o CreateProductUsecase'
    });

    return { errors: [] };
  }
}
