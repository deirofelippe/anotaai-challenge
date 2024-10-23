import { logger } from '../config/logger';
import { MongoDBSingleton } from '../config/mongodb-singleton';

export class OwnerRepository {
  public async findOwner(input: { owner: string }): Promise<any[]> {
    logger.info({
      context: 'repository',
      data: 'Iniciando o OwnerRepository.findOwner'
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
          _id: 1,
          owner: 1
        })
        .toArray();

      logger.info({
        context: 'repository',
        data: 'Finalizando o OwnerRepository.findOwner'
      });

      return result;
    } catch (error) {
      logger.error({
        context: 'repository',
        data: 'Erro no OwnerRepository.findOwner'
      });
      logger.error({ context: 'repository', data: error });
      throw error;
    }
  }
}
