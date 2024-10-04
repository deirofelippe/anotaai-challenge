import express from 'express';
import { CreateProductController } from '../Controllers/CreateProductController.js';
import { CreateProductUsecase } from '../Usecases/CreateProductUsecase.js';
import { OwnerRepository } from '../Repositories/OwnerRepository.js';
import { CategoryRepository } from '../Repositories/CategoryRepository.js';
import { ProductRepository } from '../Repositories/ProductRepository.js';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue.js';
import { UpdateProductController } from '../Controllers/UpdateProductController.js';
import { UpdateProductUsecase } from '../Usecases/UpdateProductUsecase.js';
import { DeleteProductController } from '../Controllers/DeleteProductController.js';
import { DeleteProductUsecase } from '../Usecases/DeleteProductUsecase.js';

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

const updateProductController = new UpdateProductController(
  new UpdateProductUsecase({
    ownerRepository: new OwnerRepository(),
    categoryRepository: new CategoryRepository(),
    productRepository: new ProductRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.patch(
  '/v1/products/:title',
  updateProductController.execute.bind(updateProductController)
);

const deleteProductController = new DeleteProductController(
  new DeleteProductUsecase({
    ownerRepository: new OwnerRepository(),
    categoryRepository: new CategoryRepository(),
    productRepository: new ProductRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.delete(
  '/v1/products',
  deleteProductController.execute.bind(deleteProductController)
);

const productRoutes = router;

export { productRoutes };
