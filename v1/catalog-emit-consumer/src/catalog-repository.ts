import { Category } from './compile-catalog-controller';
import { MongoInstance } from './config/mongo-instance';

export type FindProductsAndCategoriesByOwnerOutput = {
  products: any[];
  categories: any[];
};

export type FindProductsAndCategoriesByOwnerInput = {
  owner: string;
};

export class CatalogRepository {
  public async findProductsAndCategoriesByOwner(
    input: FindProductsAndCategoriesByOwnerInput
  ): Promise<Category[]> {
    const db = MongoInstance.getInstance();

    try {
      const catalog = await db
        .collection<Category>('catalog')
        .find({ owner: input.owner })
        .project<Category>({
          _id: 0,
          owner: 1,
          catalog: 1
        })
        .toArray();

      return catalog;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
