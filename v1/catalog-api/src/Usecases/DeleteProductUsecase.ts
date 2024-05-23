import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { ProductRepository } from '../Repositories/ProductRepository';

export type DeleteProductUsecaseInput = {
  product: string;
  category: string;
  owner: string;
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

  public async execute(input: DeleteProductUsecaseInput): Promise<any> {
    const {
      productRepository,
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue
    } = this.deleteProductUsecaseConstructor;

    // const validator = new DeleteProductValidator();
    // const { newData, errors } = validator.validate(input);
    const newData = input;

    // if (errors.length > 0) {
    //   return { errors: errors };
    // }

    const product: DeleteProductUsecaseInput = {
      owner: input.owner,
      category: input.category,
      product: input.product
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
      title: product.product
    });

    if (productFound.length <= 0) {
      return { errors: [{ message: 'Produto não existe' }] };
    }

    await productRepository.deleteProduct(product);
    await newRecordedDataQueue.sendMessage({ owner: product.owner });

    return { errors: [] };
  }
}
