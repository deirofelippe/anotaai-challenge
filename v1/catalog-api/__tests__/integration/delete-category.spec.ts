import { Collection, Document } from 'mongodb';
import { MongoDBSingleton } from '../../src/Config/MongoDBSingleton';
import { RabbitMQSingleton } from '../../src/Config/RabbitMQSingleton';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { OwnerRepository } from '../../src/Repositories/OwnerRepository';
import {
  DeleteCategoryUsecase,
  DeleteCategoryUsecaseInput
} from '../../src/Usecases/DeleteCategoryUsecase';

describe('DeleteCategoryUsecase', () => {
  let mongoInstance: Collection<Document>;

  beforeAll(async () => {
    await MongoDBSingleton.connect();
    await RabbitMQSingleton.connect();

    mongoInstance = MongoDBSingleton.getInstance().collection('catalog');
    await mongoInstance.insertOne({});
  });

  afterAll(async () => {
    await MongoDBSingleton.close();
    await RabbitMQSingleton.close();
  });

  describe('Delete category', () => {
    const deleteCategoryUsecase = new DeleteCategoryUsecase({
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

    test('Deve deletar categoria', async () => {
      const input: DeleteCategoryUsecaseInput = {
        owner: '321',
        category: 'Computador'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await deleteCategoryUsecase.execute(input);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const categoriesLengthBefore = createdCatalogBefore[0].catalog;
      const categoriesLengthAfter = createdCatalogAfter[0].catalog;

      expect(categoriesLengthBefore).toHaveLength(1);
      expect(categoriesLengthAfter).toHaveLength(0);
      expect(inputQueue.owner).toEqual(input.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve dar erro de owner não existente', async () => {
      const input: DeleteCategoryUsecaseInput = {
        owner: '32',
        category: 'Computador'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await deleteCategoryUsecase.execute(input);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Owner não existe');
    });

    test('Deve dar erro de categoria não existente', async () => {
      const input: DeleteCategoryUsecaseInput = {
        owner: '321',
        category: 'Games'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await deleteCategoryUsecase.execute(input);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Categoria não existe');
    });
  });
});
