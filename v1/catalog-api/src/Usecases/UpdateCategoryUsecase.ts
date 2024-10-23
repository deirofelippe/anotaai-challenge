import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import {
  CategoryRepository,
  UpdateCategoryRepositoryInput
} from '../Repositories/CategoryRepository';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { UpdateCategoryValidator } from '../Validators/UpdateCategoryValidator';
import { log, logger } from '../Config/Logger';

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
    logger.info({
      context: 'usecase',
      data: 'Iniciando o UpdateCategoryUsecase'
    });

    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new UpdateCategoryValidator();
    const { newData, errors } = validator.validate(input);
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da validação', errors }
    });

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
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da busca por owner', ownerFound }
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: newCategory.owner,
      title: newCategory.category
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

    await categoryRepository.updateCategory(newCategory);
    await newRecordedDataQueue.sendMessage({ owner: newCategory.owner });

    logger.info({
      context: 'usecase',
      data: 'Finalizando o UpdateCategoryUsecase'
    });

    return { errors: [] };
  }
}
