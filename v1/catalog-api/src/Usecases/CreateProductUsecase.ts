import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue.js';
import { CreateProductValidator } from '../Validators/CreateProductValidator.js';
import { ErrorMessages } from '../types';
import { ProductRepository } from '../Repositories/ProductRepository.js';
import { CategoryRepository } from '../Repositories/CategoryRepository.js';
import { OwnerRepository } from '../Repositories/OwnerRepository.js';

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
    const {
      productRepository,
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue
    } = this.createProductUsecaseConstructor;

    const validator = new CreateProductValidator();
    const { newData, errors } = validator.validate(input);

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

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: product.owner,
      title: product.category
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    const productFound = await productRepository.findProductByTitle({
      owner: product.owner,
      category: product.category,
      title: product.title
    });

    if (productFound.length > 0) {
      return { errors: [{ message: 'Produto já cadastrado' }] };
    }

    await productRepository.createProduct(product);
    await newRecordedDataQueue.sendMessage({ owner: product.owner });

    return { errors: [] };
  }
}
