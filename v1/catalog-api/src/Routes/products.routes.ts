import express from 'express';
import { CreateProductController } from '../Controllers/CreateProductController';
import { CreateProductUsecase } from '../Usecases/CreateProductUsecase';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { ProductRepository } from '../Repositories/ProductRepository';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';

const router = express.Router();

const createProductController = new CreateProductController(
  new CreateProductUsecase({
    ownerRepository: new OwnerRepository(),
    categoryRepository: new CategoryRepository(),
    productRepository: new ProductRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.post(
  '/v1/products',
  createProductController.execute.bind(createProductController)
);

const productRoutes = router;

export { productRoutes };
