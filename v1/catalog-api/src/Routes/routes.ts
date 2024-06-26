import express, { Request, Response } from 'express';
import { CategoryRepository } from '../Repositories/CategoryRepository';

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

router.get('/v1/all', async (req: Request, res: Response) => {
  try {
    const all = await new CategoryRepository().findAll();
    return res.status(200).json(all);
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

const indexRoutes = router;

export { indexRoutes };
