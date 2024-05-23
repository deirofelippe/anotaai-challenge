import { DeleteProductUsecaseInput } from '@tests/integration/delete-product.spec';
import { MongoDBSingleton } from '../Config/MongoDBSingleton';
import { Product } from '../Usecases/CreateProductUsecase';
import { log } from '../Config/Logger';

export class ProductRepository {
  public async createProduct(input: Product) {
    const db = MongoDBSingleton.getInstance();

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

  public async deleteProduct(input: DeleteProductUsecaseInput) {
    const db = MongoDBSingleton.getInstance();

    try {
      await db.collection('catalog').updateOne(
        {
          owner: input.owner,
          'catalog.category_title': input.category
        },
        {
          //@ts-ignore
          $pull: {
            'catalog.$[].itens': {
              title: input.product
            }
          }
        }
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
    const db = MongoDBSingleton.getInstance();

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
