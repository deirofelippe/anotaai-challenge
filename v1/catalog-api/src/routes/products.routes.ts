import express from 'express';
import { CreateProductController } from '../controllers/create-product-controller';
import { CreateProductUsecase } from '../usecases/create-product-usecase';
import { OwnerRepository } from '../repositories/owner-repository';
import { CategoryRepository } from '../repositories/category-repository';
import { ProductRepository } from '../repositories/product-repository';
import { NewRecordedDataQueue } from '../queues/new-recorded-data-queue';
import { UpdateProductController } from '../controllers/update-product-controller';
import { UpdateProductUsecase } from '../usecases/update-product-usecase';
import { DeleteProductController } from '../controllers/delete-product-controller';
import { DeleteProductUsecase } from '../usecases/delete-product-usecase';

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
