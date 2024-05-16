import { CatalogRepository } from './CatalogRepository';

export type CompileCatalogUsecaseOutput = {
  owner: string;
};
export type CompileCatalogUsecaseInput = {
  owner: string;
};

export class CompileCatalogUsecase {
  constructor(private catalogRepository: CatalogRepository) {}

  public async execute(
    input: CompileCatalogUsecaseInput
  ): Promise<CompileCatalogUsecaseOutput> {}
}
