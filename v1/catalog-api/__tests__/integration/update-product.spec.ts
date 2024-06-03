import { MongoDBSingleton } from '../../src/Config/MongoDBSingleton';
import { ProductRepository } from '../../src/Repositories/ProductRepository';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { RabbitMQSingleton } from '../../src/Config/RabbitMQSingleton';
import { OwnerRepository } from '../../src/Repositories/OwnerRepository';
import { Collection, Document } from 'mongodb';
import {
  UpdateProductUsecase,
  UpdateProductUsecaseInput
} from '../../src/Usecases/UpdateProductUsecase';

describe('UpdateProductUsecase', () => {
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

  describe('Update category', () => {
    const updateProductUsecase = new UpdateProductUsecase({
      ownerRepository: new OwnerRepository(),
      categoryRepository: new ProductRepository(),
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

    let category: UpdateProductUsecaseInput;

    beforeEach(() => {
      category = {
        owner: '321',
        category: 'Computador',
        fields: {
          title: 'Title atualizado',
          description: 'Description atualizado'
        }
      };
    });

    test('Deve atualizar title e description de categoria', async () => {
      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(category);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const categoryBefore = createdCatalogBefore[0].catalog[0];
      const categoryAfter = createdCatalogAfter[0].catalog[0];

      expect(categoryBefore).not.toEqual(
        expect.objectContaining({
          category_description: category.fields.description,
          category_title: category.fields.title
        })
      );
      expect(categoryAfter).toEqual(
        expect.objectContaining({
          category_description: category.fields.description,
          category_title: category.fields.title
        })
      );
      expect(inputQueue.owner).toEqual(category.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve atualizar title de categoria', async () => {
      delete category.fields.description;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(category);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const categoryBefore = createdCatalogBefore[0].catalog[0];
      const categoryAfter = createdCatalogAfter[0].catalog[0];

      expect(categoryBefore).not.toEqual(
        expect.objectContaining({
          category_title: category.fields.title
        })
      );
      expect(categoryAfter).toEqual(
        expect.objectContaining({
          category_title: category.fields.title
        })
      );
      expect(categoryBefore).toEqual(
        expect.objectContaining({
          category_description: categoryAfter.category_description
        })
      );
      expect(inputQueue.owner).toEqual(category.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve atualizar description de categoria', async () => {
      delete category.fields.title;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(category);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const categoryBefore = createdCatalogBefore[0].catalog[0];
      const categoryAfter = createdCatalogAfter[0].catalog[0];

      expect(categoryBefore).not.toEqual(
        expect.objectContaining({
          category_description: category.fields.description
        })
      );
      expect(categoryAfter).toEqual(
        expect.objectContaining({
          category_description: category.fields.description
        })
      );
      expect(categoryBefore).toEqual(
        expect.objectContaining({
          category_title: categoryAfter.category_title
        })
      );
      expect(inputQueue.owner).toEqual(category.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Não deve atualizar categoria sem campos para atualizar', async () => {
      delete category.fields.title;
      delete category.fields.description;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(category);

      expect(output.errors[0].message).toEqual(
        'Algum campo deve ser preenchido'
      );
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });

    test('Não deve atualizar categoria não existe', async () => {
      category.category = '111';

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(category);

      expect(output.errors[0].message).toEqual('Categoria não existe');
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });

    test('Não deve atualizar owner não existe', async () => {
      category.owner = 'Teste';

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(category);

      expect(output.errors[0].message).toEqual('Owner não existe');
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });
  });
});
