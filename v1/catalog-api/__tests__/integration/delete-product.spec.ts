import { MongoDBSingleton } from '../../src/Config/MongoDBSingleton';
import {
  CreateProductInput,
  CreateProductUsecase,
  Product
} from '../../src/Usecases/CreateProductUsecase';
import { ProductRepository } from '../../src/Repositories/ProductRepository';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { RabbitMQSingleton } from '../../src/Config/RabbitMQSingleton';
import { faker } from '@faker-js/faker';
import { OwnerRepository } from '../../src/Repositories/OwnerRepository';
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { Collection, Document } from 'mongodb';
import { log } from '../../src/Config/Logger';

//recebe um titulo, busca o titulo, se existir, deleta, senao
//recebe como query owner=123&category=BlaBla
describe('DeleteProductUsecase', () => {
  let mongoInstance: Collection<Document>;

  beforeAll(async () => {
    await MongoDBSingleton.connect();
    await RabbitMQSingleton.connect();

    mongoInstance = MongoDBSingleton.getInstance().collection('catalog');
  });

  afterAll(async () => {
    await MongoDBSingleton.close();
    await RabbitMQSingleton.close();
  });

  describe('Delete product', () => {
    beforeEach(async () => {
      await mongoInstance.drop();

      const catalog = [
        {
          owner: '321',
          catalog: [
            {
              category_title: 'Computador',
              category_description: 'Dispositivos para computador',
              itens: [
                {
                  title: 'RTX 3060',
                  description: 'Placa de vídeo',
                  price: 1699.99
                },
                {
                  title: 'Ryzen 5 5600X',
                  description: 'Processador',
                  price: 1039.99
                }
              ]
            }
          ]
        }
      ];

      await mongoInstance.insertMany(catalog);
    });

    afterEach(async () => {
      jest.restoreAllMocks();
    });

    test('Deve deletar produto', async () => {
      const input: DeleteProductUsecaseInput = {
        owner: '321',
        category: 'Computador',
        product: 'Ryzen 5 5600X'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const deleteProductUsecase = new DeleteProductUsecase({
        ownerRepository: new OwnerRepository(),
        categoryRepository: new CategoryRepository(),
        productRepository: new ProductRepository(),
        newRecordedDataQueue: new NewRecordedDataQueue()
      });

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await deleteProductUsecase.execute(input);
      const createdCatalogAfter = await mongoInstance.find().toArray();
      log(createdCatalogAfter);

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const productsLengthBefore = createdCatalogBefore[0].catalog[0].itens;
      const productsLengthAfter = createdCatalogAfter[0].catalog[0].itens;

      expect(productsLengthBefore).toHaveLength(2);
      expect(productsLengthAfter).toHaveLength(1);
      expect(inputQueue.owner).toEqual(input.owner);
      expect(output.errors).toHaveLength(0);
    });
  });
});

export type DeleteProductUsecaseInput = {
  product: string;
  category: string;
  owner: string;
};

export type DeleteProductUsecaseConstructor = {
  ownerRepository: OwnerRepository;
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  newRecordedDataQueue: NewRecordedDataQueue;
};

export class DeleteProductUsecase {
  constructor(
    private deleteProductUsecaseConstructor: DeleteProductUsecaseConstructor
  ) {}

  public async execute(input: DeleteProductUsecaseInput): Promise<any> {
    const {
      productRepository,
      categoryRepository,
      ownerRepository,
      newRecordedDataQueue
    } = this.deleteProductUsecaseConstructor;

    // const validator = new DeleteProductValidator();
    // const { newData, errors } = validator.validate(input);
    const newData = input;

    // if (errors.length > 0) {
    //   return { errors: errors };
    // }

    const product: DeleteProductUsecaseInput = {
      owner: input.owner,
      category: input.category,
      product: input.product
    };

    const ownerFound = await ownerRepository.findOwner({
      owner: product.owner
    });

    if (ownerFound.length <= 0) {
      return { errors: [{ message: 'Owner não existe' }] };
    }

    const categoryFound = await categoryRepository.findCategoryByTitle({
      owner: product.owner,
      title: product.category
    });

    if (categoryFound.length <= 0) {
      return { errors: [{ message: 'Categoria não existe' }] };
    }

    const productFound = await productRepository.findProductByTitle({
      owner: product.owner,
      category: product.category,
      title: product.product
    });

    if (productFound.length <= 0) {
      return { errors: [{ message: 'Produto não existe' }] };
    }

    await productRepository.deleteProduct(product);
    await newRecordedDataQueue.sendMessage({ owner: product.owner });

    return { errors: [] };
    // valida campos
    //verifica se owner existe e pode retornar error
    //verifica se category existe e pode retornar error
    //verifica se product existe e pode retornar error
    //cria
    //publica msg
  }
}
