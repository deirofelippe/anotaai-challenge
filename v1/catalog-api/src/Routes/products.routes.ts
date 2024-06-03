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

//recebe um titulo, busca o titulo, se existir, deleta, senao
//recebe como query owner=123&category=BlaBla
// const deleteProductController = new DeleteProductController(
//   new DeleteProductUsecase({
//     ownerRepository: new OwnerRepository(),
//     categoryRepository: new CategoryRepository(),
//     productRepository: new ProductRepository(),
//     newRecordedDataQueue: new NewRecordedDataQueue()
//   })
// );
// router.delete(
//   '/v1/products/:title',
//   deleteProductController.execute.bind(deleteProductController)
// );

const productRoutes = router;

export { productRoutes };
