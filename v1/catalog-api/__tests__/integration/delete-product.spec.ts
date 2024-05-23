import { MongoDBSingleton } from '../../src/Config/MongoDBSingleton';
import { ProductRepository } from '../../src/Repositories/ProductRepository';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { RabbitMQSingleton } from '../../src/Config/RabbitMQSingleton';
import { OwnerRepository } from '../../src/Repositories/OwnerRepository';
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { Collection, Document } from 'mongodb';
import {
  DeleteProductUsecase,
  DeleteProductUsecaseInput
} from '../../src/Usecases/DeleteProductUsecase';

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
  });
});
