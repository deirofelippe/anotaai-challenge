import { Document, UpdateFilter } from 'mongodb';
import { MongoDBSingleton } from '../Config/MongoDBSingleton';
import { Product } from '../Usecases/CreateProductUsecase';
import { DeleteProductUsecaseInput } from '../Usecases/DeleteProductUsecase';
import { UpdateProductUsecaseInput } from '../Usecases/UpdateProductUsecase';
import { logger } from '../Config/Logger';

export type UpdateProductRepositoryInput = UpdateProductUsecaseInput;

export class ProductRepository {
  public async createProduct(input: Product) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o ProductRepository.createProduct'
    });
    logger.debug({
      context: 'repository',
      data: {
        input
      }
    });
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

      logger.info({
        context: 'repository',
        data: 'Finalizando o ProductRepository.createProduct'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no ProductRepository.createProduct'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async updateProduct(input: UpdateProductRepositoryInput) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o ProductRepository.updateProduct'
    });
    logger.debug({
      context: 'repository',
      data: {
        input
      }
    });
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

    logger.debug({
      context: 'repository',
      data: { description: 'Filtro do mongodb', updateFilter }
    });

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

      logger.info({
        context: 'repository',
        data: 'Finalizando o ProductRepository.updateProduct'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no ProductRepository.updateProduct'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async deleteProduct(input: DeleteProductUsecaseInput) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o ProductRepository.deleteProduct'
    });
    logger.debug({
      context: 'repository',
      data: {
        input
      }
    });
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

      logger.info({
        context: 'repository',
        data: 'Finalizando o ProductRepository.deleteProduct'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no ProductRepository.deleteProduct'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async findProductByTitle(input: {
    owner: string;
    category: string;
    title: string;
  }): Promise<any[]> {
    logger.info({
      context: 'repository',
      data: 'Iniciando o ProductRepository.findProductByTitle'
    });
    logger.debug({
      context: 'repository',
      data: {
        input
      }
    });
    const db = MongoDBSingleton.getInstance();

    try {
      const result = await db
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

      logger.info({
        context: 'repository',
        data: 'Finalizando o ProductRepository.findProductByTitle'
      });

      return result;
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no ProductRepository.findProductByTitle'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }
}
