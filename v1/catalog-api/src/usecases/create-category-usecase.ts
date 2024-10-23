import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import { CategoryRepository } from '../repositories/category-repository';
import { CreateCategoryValidator } from '../validators/create-category-validator';
import { ErrorMessages } from '../types';
import { OwnerRepository } from '../repositories/owner-repository';
import { logger } from '../config/logger';

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
    logger.info({
      context: 'usecase',
      data: 'Iniciando o CreateCategoryUsecase'
    });

    const { categoryRepository, ownerRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new CreateCategoryValidator();
    const { newData, errors } = validator.validate(input);
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da validação', errors }
    });

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
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da busca por owner', ownerFound }
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
    logger.debug({
      context: 'usecase',
      data: { description: 'Output da busca por category', categoryFound }
    });

    if (categoryFound.length > 0) {
      return { errors: [{ message: 'Categoria já existe' }] };
    }

    await categoryRepository.createCategory(category);
    await newRecordedDataQueue.sendMessage({ owner: category.owner });

    logger.info({
      context: 'usecase',
      data: 'Finalizando o CreateCategoryUsecase'
    });

    return { errors: [] };
  }
}
