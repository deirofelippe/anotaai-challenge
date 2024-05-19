import { PushOperator } from 'mongodb';
import { MongoInstance } from '../MongoInstance';
import { Product } from '../Usecases/CreateProductUsecase';

export class ProductRepository {
  public async createProduct(input: Product) {
    const db = MongoInstance.getInstance();

    try {
      await db.collection('catalog').updateOne(
        {
          owner: input.owner
        },
        {
          //@ts-ignore
          $push: {
            'catalog.$[e1].itens': {
              title: input.title,
              description: input.description,
              price: input.price
            }
          }
        },
        { arrayFilters: [{ 'e1.category_title': input.category }] }
      );
    } catch (error) {
      console.error('Erro ao criar produto no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }

  public async findProductByTitle(input: {
    owner: string;
    category: string;
    title: string;
  }): Promise<any[]> {
    const db = MongoInstance.getInstance();

    try {
      return await db
        .collection('catalog')
        .find({
          owner: input.owner,
          'catalog.category_title': input.category,
          'catalog.itens.title': input.title
        })
        .project({
          _id: 0,
          owner: 1,
          'catalog.category_title': 1,
          'catalog.itens.title': 1,
          'catalog.itens.price': 1
        })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar produto no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }
}
