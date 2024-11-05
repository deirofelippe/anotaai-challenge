import { AsyncMessage, ConsumerStatus } from 'rabbitmq-client';
import { CompileCatalogUsecase } from './compile-catalog-usecase';

export type Category = {
  owner: string;
  category_title: string;
  category_description: string;
};

export type Catalog = {
  owner: string;
  catalog: {
    category_title: string;
    category_description: string;
    itens: {
      title: string;
      description: string;
      price: number;
    }[];
  }[];
};

export type CompileCatalogControllerOutput = ConsumerStatus;

export type CompileCatalogControllerInput = AsyncMessage;

function sleep(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

export class CompileCatalogController {
  constructor(private compileCatalogUsecase: CompileCatalogUsecase) {}

  public async execute(
    input: CompileCatalogControllerInput
  ): Promise<CompileCatalogControllerOutput> {
    // await sleep(500);

    try {
      const owner = input.body.owner;

      this.compileCatalogUsecase.execute({ owner: owner });

      return ConsumerStatus.ACK;
    } catch (error) {
      console.log(error);
      return ConsumerStatus.REQUEUE;
    }
  }
}
