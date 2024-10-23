import express from 'express';
import { CreateCategoryController } from '../controllers/create-category-controller';
import { CreateCategoryUsecase } from '../usecases/create-category-usecase';
import { OwnerRepository } from '../repositories/owner-repository';
import { CategoryRepository } from '../repositories/category-repository';
import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import { UpdateCategoryUsecase } from '../usecases/update-category-usecase';
import { UpdateCategoryController } from '../controllers/update-category-controller';
import { DeleteCategoryController } from '../controllers/delete-category-controller';
import { DeleteCategoryUsecase } from '../usecases/delete-category-usecase';

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
