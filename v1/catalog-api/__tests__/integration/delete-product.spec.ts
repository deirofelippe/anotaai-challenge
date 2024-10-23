import { MongoDBSingleton } from '../../src/config/mongodb-singleton';
import { ProductRepository } from '../../src/repositories/product-repository';
import { NewRecordedDataQueue } from '../../src/queues/new-recorded-data-queue';
import { OwnerRepository } from '../../src/repositories/owner-repository';
import { CategoryRepository } from '../../src/repositories/category-repository';
import { Collection, Document } from 'mongodb';
import {
  DeleteProductUsecase,
  DeleteProductUsecaseInput
} from '../../src/usecases/delete-product-usecase';

describe('DeleteProductUsecase', () => {
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

  describe('Delete product', () => {
    const deleteProductUsecase = new DeleteProductUsecase({
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

    test('Deve deletar produto', async () => {
      const input: DeleteProductUsecaseInput = {
        owner: '321',
        category: 'Computador',
        product: 'Ryzen 5 5600X'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await deleteProductUsecase.execute(input);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const productsLengthBefore = createdCatalogBefore[0].catalog[0].itens;
      const productsLengthAfter = createdCatalogAfter[0].catalog[0].itens;

      expect(productsLengthBefore).toHaveLength(2);
      expect(productsLengthAfter).toHaveLength(1);
      expect(inputQueue.owner).toEqual(input.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve dar erro de owner não existente', async () => {
      const input: DeleteProductUsecaseInput = {
        owner: '32',
        category: 'Computador',
        product: 'Ryzen 5 5600X'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await deleteProductUsecase.execute(input);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Owner não existe');
    });

    test('Deve dar erro de categoria não existente', async () => {
      const input: DeleteProductUsecaseInput = {
        owner: '321',
        category: 'Games',
        product: 'Ryzen 5 5600X'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await deleteProductUsecase.execute(input);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Categoria não existe');
    });

    test('Deve dar erro de produto não existente', async () => {
      const input: DeleteProductUsecaseInput = {
        owner: '321',
        category: 'Computador',
        product: 'Monitor LG UltraGrear 27"'
      };

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await deleteProductUsecase.execute(input);

      expect(sendMessageMock).toHaveBeenCalledTimes(0);
      expect(output.errors[0].message).toContain('Produto não existe');
    });
  });
});
