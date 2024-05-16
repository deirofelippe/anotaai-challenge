import { MongoInstance } from './MongoInstance';

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
  ): Promise<FindProductsAndCategoriesByOwnerOutput> {
    const db = MongoInstance.getInstance();

    try {
      const result = await db.collection('').find({}).toArray();
      const products = [];
      const categories = [];
      return { products, categories };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
