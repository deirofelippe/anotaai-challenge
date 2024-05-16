import { randomUUID } from 'crypto';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { CreateCategoryValidator } from '../Validators/CreateCategoryValidator';
import { ErrorMessages } from '../types';

export type Category = {
  owner: string;
  title: string;
  description?: string;
};

export type CreateCategoryInput = Category;

export type CreateCategoryOutput = {
  errors: ErrorMessages['errors'];
};

export type CreateCategoryUsecaseConstructor = {
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class CreateCategoryUsecase {
  constructor(
    private createCategoryUsecaseConstructor: CreateCategoryUsecaseConstructor
  ) {}

  public async execute(
    input: CreateCategoryInput
  ): Promise<CreateCategoryOutput> {
    const { categoryRepository, newRecordedDataQueue } =
      this.createCategoryUsecaseConstructor;

    const validator = new CreateCategoryValidator();
    const { newData, errors } = validator.validate(input);

    if (errors.length > 0) {
      return { errors: errors };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      title: input.title
    });

    if (categoryFound.length > 0) {
      return { errors: [{ message: 'Categoria já existente' }] };
    }

    const category: Category = {
      owner: newData!.owner,
      title: newData!.title,
      description: newData?.description
    };
    console.log(category);

    await categoryRepository.createCategory(category);

    await newRecordedDataQueue.sendMessage({ owner: category.owner });

    return { errors: [] };
  }
}
