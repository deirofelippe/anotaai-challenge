import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue.js';
import { CategoryRepository } from '../Repositories/CategoryRepository.js';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../Repositories/OwnerRepository.js';
import { DeleteCategoryValidator } from '../Validators/DeleteCategoryValidator.js';

export type DeleteCategoryUsecaseInput = {
  category: string;
  owner: string;
};

export type DeleteCategoryUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type DeleteCategoryUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class DeleteCategoryUsecase {
  constructor(
    private createCategoryUsecaseConstructor: DeleteCategoryUsecaseConstructor
  ) {}

  public async execute(
    input: DeleteCategoryUsecaseInput
  ): Promise<DeleteCategoryUsecaseOutput> {
    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new DeleteCategoryValidator();
    const { newData, errors } = validator.validate(input);

    if (errors.length > 0) {
      return { errors: errors };
    }

    const category: DeleteCategoryUsecaseInput = {
      owner: newData!.owner,
      category: newData!.category
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: category.owner
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: category.owner,
      title: category.category
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    await categoryRepository.deleteCategory(category);
    await newRecordedDataQueue.sendMessage({ owner: category.owner });

    return { errors: [] };
  }
}
