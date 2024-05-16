import { MongoInstance } from '../MongoInstance';
import { Category } from '../Usecases/CreateCategoryUsecase';

export class CategoryRepository {
  public async createCategory(input: Category) {
    const db = MongoInstance.getInstance();

    try {
      await db.collection('catalog').insertOne({
        owner: input.owner,
        category_title: input.title,
        category_description: input.description
      });
    } catch (error) {
      console.error('Erro ao criar categoria no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async findCategoryByTitle(input: { title: string }): Promise<any[]> {
    const db = MongoInstance.getInstance();

    try {
      return await db
        .collection('catalog')
        .find({
          category_title: input.title
        })
        .project({
          _id: 0,
          owner: 1,
          category_title: 1,
          category_description: 1
        })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar categoria no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async findCategoriesByOwner(input: { owner: string }): Promise<any[]> {
    const db = MongoInstance.getInstance();
    console.log(input);

    try {
      return await db
        .collection('catalog')
        .find({
          owner: input.owner
        })
        .project({
          _id: 0,
          owner: 1,
          category_title: 1,
          category_description: 1
        })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar categoria no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async findAll(): Promise<any[]> {
    const db = MongoInstance.getInstance();

    try {
      return await db
        .collection('catalog')
        .find()
        .project({
          _id: 0,
          owner: 1,
          category_title: 1,
          category_description: 1
        })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar categoria no banco');
      console.error('Dados: ', JSON.stringify({}));
      throw error;
    }
  }

  public async dropCollection(input?: { name: string }) {
    const db = MongoInstance.getInstance();

    try {
      await db.collection('catalog').drop({});
      return;
    } catch (error) {
      console.error('Erro ao fazer drop de collection no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }
}
