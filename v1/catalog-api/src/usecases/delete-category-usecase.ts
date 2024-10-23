import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import { CategoryRepository } from '../repositories/category-repository';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../repositories/owner-repository';
import { DeleteCategoryValidator } from '../validators/delete-category-validator';
import { logger } from '../config/logger';

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
    logger.info({
      context: 'usecase',
      data: 'Iniciando o DeleteCategoryUsecase'
    });

    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new DeleteCategoryValidator();
    const { newData, errors } = validator.validate(input);
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da validação', errors }
    });

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
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da busca por owner', ownerFound }
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: category.owner,
      title: category.category
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

    await categoryRepository.deleteCategory(category);
    await newRecordedDataQueue.sendMessage({ owner: category.owner });

    logger.info({
      context: 'usecase',
      data: 'Finalizando o DeleteCategoryUsecase'
    });

    return { errors: [] };
  }
}
