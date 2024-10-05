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
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { log } from '../../src/Config/Logger';

describe('UpdateProductUsecase', () => {
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

  describe('Update product', () => {
    const updateProductUsecase = new UpdateProductUsecase({
      ownerRepository: new OwnerRepository(),
      productRepository: new ProductRepository(),
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

    let product: UpdateProductUsecaseInput;

    beforeEach(() => {
      product = {
        owner: '321',
        product: 'RTX 3060',
        category: 'Computador',
        fields: {
          title: 'Title atualizado',
          description: 'Description atualizado',
          price: 1700.5
        }
      };
    });

    test('Deve atualizar title, description e price de produto', async () => {
      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(product);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const productBefore = createdCatalogBefore[0].catalog[0].itens[0];
      const productAfter = createdCatalogAfter[0].catalog[0].itens[0];

      expect(productBefore).not.toEqual(
        expect.objectContaining({
          description: product.fields.description,
          title: product.fields.title,
          price: product.fields.price
        })
      );
      expect(productAfter).toEqual(
        expect.objectContaining({
          description: product.fields.description,
          title: product.fields.title,
          price: product.fields.price
        })
      );
      expect(inputQueue.owner).toEqual(product.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve atualizar title de produto', async () => {
      delete product.fields.description;
      delete product.fields.price;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(product);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const productBefore = createdCatalogBefore[0].catalog[0].itens[0];
      const productAfter = createdCatalogAfter[0].catalog[0].itens[0];

      expect(productAfter).toEqual(
        expect.objectContaining({
          title: product.fields.title
        })
      );

      expect(productBefore).toEqual(
        expect.objectContaining({
          description: productAfter.description,
          price: productAfter.price
        })
      );

      expect(inputQueue.owner).toEqual(product.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve atualizar description de produto', async () => {
      delete product.fields.title;
      delete product.fields.price;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(product);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const productBefore = createdCatalogBefore[0].catalog[0].itens[0];
      const productAfter = createdCatalogAfter[0].catalog[0].itens[0];

      expect(productAfter).toEqual(
        expect.objectContaining({
          description: product.fields.description
        })
      );

      expect(productBefore).toEqual(
        expect.objectContaining({
          title: productAfter.title,
          price: productAfter.price
        })
      );

      expect(inputQueue.owner).toEqual(product.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Deve atualizar price de produto', async () => {
      delete product.fields.title;
      delete product.fields.description;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createdCatalogBefore = await mongoInstance.find().toArray();
      const output = await updateProductUsecase.execute(product);
      const createdCatalogAfter = await mongoInstance.find().toArray();

      const inputQueue = sendMessageMock.mock.calls[0][0];

      const productBefore = createdCatalogBefore[0].catalog[0].itens[0];
      const productAfter = createdCatalogAfter[0].catalog[0].itens[0];

      expect(productAfter).toEqual(
        expect.objectContaining({
          price: product.fields.price
        })
      );

      expect(productBefore).toEqual(
        expect.objectContaining({
          title: productAfter.title,
          description: productAfter.description
        })
      );

      expect(inputQueue.owner).toEqual(product.owner);
      expect(output.errors).toHaveLength(0);
    });

    test('Não deve atualizar produto sem campos para atualizar', async () => {
      delete product.fields.title;
      delete product.fields.description;
      delete product.fields.price;

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(product);

      expect(output.errors[0].message).toEqual(
        'Algum campo deve ser preenchido'
      );
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });

    test('Não deve atualizar categoria não existe', async () => {
      product.category = '111';

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(product);

      expect(output.errors[0].message).toEqual('Categoria não existe');
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });

    test('Não deve atualizar produto não existe', async () => {
      product.product = '111';

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(product);

      expect(output.errors[0].message).toEqual('Produto não existe');
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });

    test('Não deve atualizar owner não existe', async () => {
      product.owner = 'Teste';

      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const output = await updateProductUsecase.execute(product);

      expect(output.errors[0].message).toEqual('Owner não existe');
      expect(sendMessageMock).toHaveBeenCalledTimes(0);
    });
  });
});
