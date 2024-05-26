import { MongoDBSingleton } from '../Config/MongoDBSingleton';
import { Category } from '../Usecases/CreateCategoryUsecase';

export class CategoryRepository {
  public async createCategory(input: Category) {
    const db = MongoDBSingleton.getInstance();

    try {
      await db.collection('catalog').updateOne(
        { owner: input.owner },
        {
          //@ts-ignore
          $push: {
            catalog: {
              category_title: input.title,
              category_description: input.description,
              itens: []
            }
          }
        }
      );
    } catch (error) {
      console.error('Erro ao criar categoria no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async deleteCategory(input: { owner: string; category: string }) {
    const db = MongoDBSingleton.getInstance();

    try {
      await db.collection('catalog').updateOne(
        { owner: input.owner },
        {
          //@ts-ignore
          $pull: {
            catalog: {
              category_title: input.category
            }
          }
        }
      );
    } catch (error) {
      console.error('Erro ao criar categoria no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async createOwnerAndCategory(input: Category) {
    const db = MongoDBSingleton.getInstance();

    try {
      await db.collection('catalog').insertOne({
        owner: input.owner,
        catalog: [
          {
            category_title: input.title,
            category_description: input.description
          }
        ]
      });
    } catch (error) {
      console.error('Erro ao criar categoria no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async findCategoryByTitle(input: {
    owner: string;
    title: string;
  }): Promise<any[]> {
    const db = MongoDBSingleton.getInstance();

    try {
      return await db
        .collection('catalog')
        .find({
          owner: input.owner,
          'catalog.category_title': input.title
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
    const db = MongoDBSingleton.getInstance();
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
    const db = MongoDBSingleton.getInstance();

    try {
      return await db
        .collection('catalog')
        .find()
        .project({
          _id: 0
        })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar categoria no banco');
      console.error('Dados: ', JSON.stringify({}));
      throw error;
    }
  }

  public async dropCollection(input?: { name: string }) {
    const db = MongoDBSingleton.getInstance();

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
