import express from 'express';
import { CreateCategoryController } from '../Controllers/CreateCategoryController.js';
import { CreateCategoryUsecase } from '../Usecases/CreateCategoryUsecase.js';
import { OwnerRepository } from '../Repositories/OwnerRepository.js';
import { CategoryRepository } from '../Repositories/CategoryRepository.js';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue.js';
import { UpdateCategoryUsecase } from '../Usecases/UpdateCategoryUsecase.js';
import { UpdateCategoryController } from '../Controllers/UpdateCategoryController.js';
import { DeleteCategoryController } from '../Controllers/DeleteCategoryController.js';
import { DeleteCategoryUsecase } from '../Usecases/DeleteCategoryUsecase.js';

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
  '/v1/categories/:title',
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
