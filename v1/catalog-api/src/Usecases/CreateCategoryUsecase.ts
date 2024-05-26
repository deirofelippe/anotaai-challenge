import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { CreateCategoryValidator } from '../Validators/CreateCategoryValidator';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../Repositories/OwnerRepository';

export type Category = {
  owner: string;
  title: string;
  description?: string;
};

export type CreateCategoryUsecaseInput = Category;

export type CreateCategoryUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type CreateCategoryUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class CreateCategoryUsecase {
  constructor(
    private createCategoryUsecaseConstructor: CreateCategoryUsecaseConstructor
  ) {}

  public async execute(
    input: CreateCategoryUsecaseInput
  ): Promise<CreateCategoryUsecaseOutput> {
    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new CreateCategoryValidator();
    const { newData, errors } = validator.validate(input);

    if (errors.length > 0) {
      return { errors: errors };
    }

    const category: Category = {
      owner: newData!.owner,
      title: newData!.title,
      description: newData?.description
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: category.owner
    });

    if (ownerFound.length <= 0) {
      await categoryRepository.createOwnerAndCategory(category);
      await newRecordedDataQueue.sendMessage({ owner: category.owner });

      return { errors: [] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: category.owner,
      title: category.title
    });

    if (categoryFound.length > 0) {
      return { errors: [{ message: 'Categoria já existe' }] };
    }

    await categoryRepository.createCategory(category);
    await newRecordedDataQueue.sendMessage({ owner: category.owner });

    return { errors: [] };
  }
}
