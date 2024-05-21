import express from 'express';
import { CreateCategoryController } from '../Controllers/CreateCategoryController';
import { CreateCategoryUsecase } from '../Usecases/CreateCategoryUsecase';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';

const router = express.Router();

const createCategoryController = new CreateCategoryController(
  new CreateCategoryUsecase({
    ownerRepository: new OwnerRepository(),
    categoryRepository: new CategoryRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.post(
  '/v1/categories',
  createCategoryController.execute.bind(createCategoryController)
);

const categoryRoutes = router;

export { categoryRoutes };
