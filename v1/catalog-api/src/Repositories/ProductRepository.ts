import { Document, UpdateFilter } from 'mongodb';
import { MongoDBSingleton } from '../Config/MongoDBSingleton.js';
import { Product } from '../Usecases/CreateProductUsecase.js';
import { DeleteProductUsecaseInput } from '../Usecases/DeleteProductUsecase.js';
import { UpdateProductUsecaseInput } from '../Usecases/UpdateProductUsecase.js';

export type UpdateProductRepositoryInput = UpdateProductUsecaseInput;

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

  public async updateProduct(input: UpdateProductRepositoryInput) {
    const db = MongoDBSingleton.getInstance();

    const updateFilter: UpdateFilter<Document> = {
      $set: {}
    };

    if (input.fields.title) {
      updateFilter.$set = {
        ...updateFilter.$set,
        'catalog.$[e1].itens.$[e2].title': input.fields.title
      };
    }
    if (input.fields.description) {
      updateFilter.$set = {
        ...updateFilter.$set,
        'catalog.$[e1].itens.$[e2].description': input.fields.description
      };
    }
    if (input.fields.price) {
      updateFilter.$set = {
        ...updateFilter.$set,
        'catalog.$[e1].itens.$[e2].price': input.fields.price
      };
    }

    try {
      await db.collection('catalog').updateOne(
        {
          owner: input.owner
        },
        updateFilter,
        {
          arrayFilters: [
            {
              'e1.category_title': input.category
            },
            {
              'e2.title': input.product
            }
          ]
        }
      );
    } catch (error) {
      console.error('Erro ao criar categoria no banco');
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
