import { MongoDBSingleton } from '../../src/Config/MongoDBSingleton';
import { ProductRepository } from '../../src/Repositories/ProductRepository';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { RabbitMQSingleton } from '../../src/Config/RabbitMQSingleton';
import { faker } from '@faker-js/faker';
import { OwnerRepository } from '../../src/Repositories/OwnerRepository';
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { Collection, Document } from 'mongodb';
import {
  CreateProductUsecase,
  CreateProductUsecaseInput
} from '../../src/Usecases/CreateProductUsecase';

describe('CreateProductUsecase', () => {
  let mongoInstance: Collection<Document>;

  beforeAll(async () => {
    await MongoDBSingleton.connect();
    // await RabbitMQSingleton.connect();

    mongoInstance = MongoDBSingleton.getInstance().collection('catalog');
    await mongoInstance.insertOne({});
  });

  afterAll(async () => {
    await MongoDBSingleton.close();
    // await RabbitMQSingleton.close();
  });

  describe('Create product', () => {
    const createProductUsecase = new CreateProductUsecase({
      ownerRepository: new OwnerRepository(),
      categoryRepository: new CategoryRepository(),
      productRepository: new ProductRepository(),
      newRecordedDataQueue: new NewRecordedDataQueue()
    });

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

    test('Deve criar produto', async () => {
      const product: CreateProductUsecaseInput = {
        owner: '321',
        category: 'Computador',
        title: 'Monitor',
        description: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 900, max: 1500 }))
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await createProductUsecase.execute(product);

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const createdCatalog = await mongoInstance.find().toArray();
      const productsLength = createdCatalog[0].catalog[0].itens;

      expect(productsLength).toHaveLength(3);
      expect(inputQueue.owner).toEqual(product.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve dar erro de owner não existente', async () => {
      const product: CreateProductUsecaseInput = {
        owner: '32',
        category: 'Computador',
        title: 'Monitor',
        description: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 900, max: 1500 }))
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await createProductUsecase.execute(product);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Owner não existe');
    });

    test('Deve dar erro de categoria não existente', async () => {
      const product: CreateProductUsecaseInput = {
        owner: '321',
        category: 'Comp',
        title: 'Monitor',
        description: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 900, max: 1500 }))
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await createProductUsecase.execute(product);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Categoria não existe');
    });

    test('Deve dar erro de produto já existente', async () => {
      const product: CreateProductUsecaseInput = {
        owner: '321',
        category: 'Computador',
        title: 'RTX 3060',
        description: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 900, max: 1500 }))
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await createProductUsecase.execute(product);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Produto já cadastrado');
    });
  });
});
