import { MongoInstance } from '../MongoInstance';

export class OwnerRepository {
  public async findOwner(input: { owner: string }): Promise<any[]> {
    const db = MongoInstance.getInstance();

    try {
      return await db
        .collection('catalog')
        .find({
          owner: input.owner
        })
        .project({
          _id: 1,
          owner: 1
        })
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar owner no banco');
      console.error('Dados: ', JSON.stringify(input));
      throw error;
    }
  }
}
