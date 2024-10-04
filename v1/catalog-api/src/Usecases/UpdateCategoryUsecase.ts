import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue.js';
import {
  CategoryRepository,
  UpdateCategoryRepositoryInput
} from '../Repositories/CategoryRepository.js';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../Repositories/OwnerRepository.js';
import { UpdateCategoryValidator } from '../Validators/UpdateCategoryValidator.js';
import { log } from '../Config/Logger.js';

export type UpdateCategoryUsecaseInput = {
  owner: string;
  category: string;
  fields: {
    title?: string;
    description?: string;
  };
};

export type UpdateCategoryUsecaseOutput = {
  errors: ErrorMessages['errors'];
};

export type UpdateCategoryUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class UpdateCategoryUsecase {
  constructor(
    private createCategoryUsecaseConstructor: UpdateCategoryUsecaseConstructor
  ) {}

  public async execute(
    input: UpdateCategoryUsecaseInput
  ): Promise<UpdateCategoryUsecaseOutput> {
    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new UpdateCategoryValidator();
    const { newData, errors } = validator.validate(input);

    if (errors.length > 0) {
      return { errors: errors };
    }

    const newCategory: UpdateCategoryRepositoryInput = {
      owner: newData!.owner,
      category: newData!.category,
      fields: newData!.fields
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: newCategory.owner
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: newCategory.owner,
      title: newCategory.category
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    await categoryRepository.updateCategory(newCategory);
    await newRecordedDataQueue.sendMessage({ owner: newCategory.owner });

    return { errors: [] };
  }
}
