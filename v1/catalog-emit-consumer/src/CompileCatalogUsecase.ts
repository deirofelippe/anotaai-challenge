import { CatalogS3 } from './catalog-s3';
import { CatalogRepository } from './CatalogRepository';

export type CompileCatalogUsecaseOutput = {
  owner: string;
};
export type CompileCatalogUsecaseInput = {
  owner: string;
};

export class CompileCatalogUsecase {
  constructor(
    private catalogRepository: CatalogRepository,
    private catalogS3: CatalogS3
  ) {}

  public async execute(input: CompileCatalogUsecaseInput): Promise<any> {
    try {
      const owner = input.owner;

      const catalog = this.catalogRepository.findProductsAndCategoriesByOwner({
        owner
      });

      this.catalogS3.put({
        catalog,
        owner
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
