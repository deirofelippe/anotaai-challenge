import { MongoDBSingleton } from '../../src/Config/MongoDBSingleton';
import {
  CreateCategoryInput,
  CreateCategoryUsecase
} from '../../src/Usecases/CreateCategoryUsecase';
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { RabbitMQSingleton } from '../../src/Config/RabbitMQSingleton';
import { faker } from '@faker-js/faker';
import { OwnerRepository } from '../../src/Repositories/OwnerRepository';
import { Collection, Document } from 'mongodb';

describe('CreateCategoryUsecase', () => {
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

  describe('Create category', () => {
    const createCategoryUsecase = new CreateCategoryUsecase({
      ownerRepository: new OwnerRepository(),
      categoryRepository: new CategoryRepository(),
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

    test('Deve criar categoria', async () => {
      const category: CreateCategoryInput = {
        owner: '321',
        title: 'Games',
        description: 'Descrição da categoria 1'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await createCategoryUsecase.execute(category);

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const createdCatalog = await mongoInstance.find().toArray();
      const categoryLength = createdCatalog[0].catalog;
      const catalogLength = createdCatalog;

      expect(categoryLength).toHaveLength(2);
      expect(catalogLength).toHaveLength(1);
      expect(inputQueue.owner).toEqual(category.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve criar categoria com novo owner', async () => {
      const category: CreateCategoryInput = {
        owner: '123',
        title: 'Games',
        description: 'Descrição da categoria 1'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await createCategoryUsecase.execute(category);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      expect(createdCatalogBefore).toHaveLength(1);
      expect(createdCatalogAfter).toHaveLength(2);
      expect(inputQueue.owner).toEqual(category.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Não deve criar categoria já existente', async () => {
      const category: CreateCategoryInput = {
        owner: '321',
        title: 'Computador',
        description: 'Descrição da categoria 1'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await createCategoryUsecase.execute(category);

      expect(output.errors[0].message).toEqual('Categoria já existe');
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });

    test.each([
      [{ title: '       ', description: '          ' }],
      [{ title: '', description: '' }]
    ])('Deve dar erro de valor não preenchido', async (data: any) => {
      const category: CreateCategoryInput = {
        owner: '123',
        title: data.title,
        description: data.description
      };

      const output = await createCategoryUsecase.execute(category);

      expect(output.errors).toHaveLength(2);
    });

    test('Deve dar erro de valor excedido', async () => {
      const category: CreateCategoryInput = {
        owner: '123',
        title: faker.lorem.words({ min: 128, max: 128 }),
        description: faker.lorem.words({ min: 512, max: 512 })
      };

      const output = await createCategoryUsecase.execute(category);

      expect(output.errors).toHaveLength(2);
    });
  });
});
