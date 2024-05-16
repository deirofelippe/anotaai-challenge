import express, { Request, Response } from 'express';
import { CreateCategoryController } from './Controllers/CreateCategoryController';
import { CreateCategoryUsecase } from './Usecases/CreateCategoryUsecase';
import { CategoryRepository } from './Repositories/CategoryRepository';
import { NewRecordedDataQueue } from './Queues/NewRecordedDataQueue';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.delete('/clear-db', async (req: Request, res: Response) => {
  try {
    await new CategoryRepository().dropCollection();
    return res.status(204).json({});
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

const createCategoryController = new CreateCategoryController(
  new CreateCategoryUsecase({
    categoryRepository: new CategoryRepository(),
    newRecordedDataQueue: new NewRecordedDataQueue()
  })
);
router.post(
  '/v1/categories',
  createCategoryController.execute.bind(createCategoryController)
);

router.get('/v1/categories', async (req: Request, res: Response) => {
  try {
    const categories = await new CategoryRepository().findAll();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.get('/v1/owners/:id/categories', async (req: Request, res: Response) => {
  try {
    const categories = await new CategoryRepository().findCategoriesByOwner({
      owner: req.params.id
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

const apiRoutes = router;

export { apiRoutes };
