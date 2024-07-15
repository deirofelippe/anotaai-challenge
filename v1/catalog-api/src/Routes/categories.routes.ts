import express from 'express';
import { CreateCategoryController } from '../Controllers/CreateCategoryController';
import { CreateCategoryUsecase } from '../Usecases/CreateCategoryUsecase';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import { UpdateCategoryUsecase } from '../Usecases/UpdateCategoryUsecase';
import { UpdateCategoryController } from '../Controllers/UpdateCategoryController';
import { DeleteCategoryController } from '../Controllers/DeleteCategoryController';
import { DeleteCategoryUsecase } from '../Usecases/DeleteCategoryUsecase';

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

const updateCategoryController = new UpdateCategoryController(
  new UpdateCategoryUsecase({
    ownerRepository: new OwnerRepository(),
    categoryRepository: new CategoryRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.patch(
  '/v1/categories',
  updateCategoryController.execute.bind(updateCategoryController)
);

const deleteCategoryController = new DeleteCategoryController(
  new DeleteCategoryUsecase({
    ownerRepository: new OwnerRepository(),
    categoryRepository: new CategoryRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.delete(
  '/v1/categories',
  deleteCategoryController.execute.bind(deleteCategoryController)
);

const categoryRoutes = router;

export { categoryRoutes };
