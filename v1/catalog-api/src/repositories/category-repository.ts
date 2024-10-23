import { Document, UpdateFilter } from 'mongodb';
import { log, logger } from '../config/logger';
import { MongoDBSingleton } from '../config/mongodb-singleton';
import { Category } from '../usecases/create-category-usecase';
import { UpdateCategoryUsecaseInput } from '../usecases/update-category-usecase';

export type UpdateCategoryRepositoryInput = UpdateCategoryUsecaseInput;

export class CategoryRepository {
  public async createCategory(input: Category) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.createCategory'
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

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.createCategory'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.createCategory'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async updateCategory(input: UpdateCategoryRepositoryInput) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.updateCategory'
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
        'catalog.$[e1].category_title': input.fields.title
      };
    }
    if (input.fields.description) {
      updateFilter.$set = {
        ...updateFilter.$set,
        'catalog.$[e1].category_description': input.fields.description
      };
    }

    logger.debug({
      context: 'repository',
      data: { updateFilter, description: 'Filtro do mongodb' }
    });

    try {
      await db.collection('catalog').updateOne(
        {
          owner: input.owner
        },

        updateFilter,
        { arrayFilters: [{ 'e1.category_title': input.category }] }
      );

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.updateCategory'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.updateCategory'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async deleteCategory(input: { owner: string; category: string }) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.deleteCategory'
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

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.deleteCategory'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.deleteCategory'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async createOwnerAndCategory(input: Category) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.createOwnerAndCategory'
    });
    logger.debug({
      context: 'repository',
      data: {
        input
      }
    });
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

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.createOwnerAndCategory'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.createOwnerAndCategory'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async findCategoryByTitle(input: {
    owner: string;
    title: string;
  }): Promise<any[]> {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.findCategoryByTitle'
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
          'catalog.category_title': input.title
        })
        .project({
          _id: 0,
          owner: 1,
          category_title: 1,
          category_description: 1
        })
        .toArray();

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.findCategoryByTitle'
      });

      return result;
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.findCategoryByTitle'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async findCategoriesByOwner(input: { owner: string }): Promise<any[]> {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.findCategoriesByOwner'
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
          owner: input.owner
        })
        .project({
          _id: 0,
          owner: 1,
          category_title: 1,
          category_description: 1
        })
        .toArray();

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.findCategoriesByOwner'
      });

      return result;
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.findCategoriesByOwner'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async findAll(limit = 10): Promise<any[]> {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.findAll'
    });
    logger.debug({
      context: 'repository',
      data: {
        input: { limit }
      }
    });

    const db = MongoDBSingleton.getInstance();

    try {
      const result = await db
        .collection('catalog')
        .find()
        .limit(limit)
        .project({
          _id: 0
        })
        .toArray();

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.findAll'
      });

      return result;
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.findAll'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }

  public async dropCollection(input?: { name: string }) {
    logger.info({
      context: 'repository',
      data: 'Iniciando o CategoryRepository.dropCollection'
    });
    logger.debug({
      context: 'repository',
      data: {
        input
      }
    });
    const db = MongoDBSingleton.getInstance();

    try {
      await db.collection('catalog').drop({});

      logger.info({
        context: 'repository',
        data: 'Finalizando o CategoryRepository.dropCollection'
      });
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no CategoryRepository.dropCollection'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }
}
