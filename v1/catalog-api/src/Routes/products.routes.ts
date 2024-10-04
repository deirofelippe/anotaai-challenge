import express from 'express';
import { CreateProductController } from '../Controllers/CreateProductController';
import { CreateProductUsecase } from '../Usecases/CreateProductUsecase';
import { OwnerRepository } from '../Repositories/OwnerRepository';
import { CategoryRepository } from '../Repositories/CategoryRepository';
import { ProductRepository } from '../Repositories/ProductRepository';
import { NewRecordedDataQueue } from '../Queues/NewRecordedDataQueue';
import { UpdateProductController } from '../Controllers/UpdateProductController';
import { UpdateProductUsecase } from '../Usecases/UpdateProductUsecase';
import { DeleteProductController } from '../Controllers/DeleteProductController';
import { DeleteProductUsecase } from '../Usecases/DeleteProductUsecase';

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
