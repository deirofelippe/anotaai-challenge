import { MongoInstance } from '../../src/MongoInstance';
import {
  CreateCategoryInput,
  CreateCategoryUsecase
} from '../../src/Usecases/CreateCategoryUsecase';
import { CategoryRepository } from '../../src/Repositories/CategoryRepository';
import { NewRecordedDataQueue } from '../../src/Queues/NewRecordedDataQueue';
import { RabbitMQInstance } from '../../src/RabbitMQInstance';
import { faker } from '@faker-js/faker';

function sleep(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

describe('CreateCategoryUsecase', () => {
  beforeAll(async () => {
    await MongoInstance.connect();
    await RabbitMQInstance.connect();
  });

  afterAll(async () => {
    await MongoInstance.close();
    await RabbitMQInstance.close();
  });

  describe('Create category', () => {
    beforeEach(async () => {
      const categories = [
        {
          owner: '123',
          title: 'Computador',
          description: ''
        },
        {
          owner: '123',
          title: 'Games',
          description: 'Games'
        },
        {
          owner: '456',
          title: 'Quero comprar',
          description: 'Produtos gerais que quero comprar'
        }
      ];

      const items = [
        {
          owner: '123',
          category_id: 'Computador',
          title: 'RTX 3060',
          description: 'Placa de vídeo',
          price: 1699.99
        },
        {
          owner: '123',
          category_id: 'Computador',
          title: 'Ryzen 5 5600X',
          description: 'Processador',
          price: 1039.99
        },
        {
          owner: '123',
          category_id: 'Games',
          title: 'STALKER 2',
          description: 'FPS',
          price: 199.99
        },
        {
          owner: '123',
          category_id: 'Games',
          title: 'Red Dead Redemption 2',
          description: 'TPS',
          price: 299.9
        },
        {
          owner: '123',
          category_id: 'Games',
          title: 'Teste',
          description: 'TPS',
          price: 299.9
        },
        {
          owner: '456',
          category_id: 'Quero comprar',
          title: 'RTX 3060',
          description: 'Placa de vídeo',
          price: 1699.99
        },
        {
          owner: '456',
          category_id: 'Quero comprar',
          title: 'Logitech MX Keys',
          description: 'Teclado',
          price: 659.0
        }
      ];

      const catalog = [...categories, ...items];

      await MongoInstance.getInstance()
        .collection('catalog')
        .insertMany(catalog);
    });

    afterEach(async () => {
      jest.restoreAllMocks();
      // await MongoInstance.getInstance().collection('catalog').drop();
    });

    test('Deve criar categoria sem erro', async () => {
      const category: CreateCategoryInput = {
        owner: '123',
        title: 'Teste',
        description: 'Descrição da categoria 1'
      };

      jest
        .spyOn(CategoryRepository.prototype, 'findCategoryByTitle')
        .mockImplementation(async () => []);
      const createCategoryMock = jest
        .spyOn(CategoryRepository.prototype, 'createCategory')
        .mockImplementation(async () => {});
      const sendMessageMock = jest
        .spyOn(NewRecordedDataQueue.prototype, 'sendMessage')
        .mockImplementation(async () => {});

      const createCategoryUsecase = new CreateCategoryUsecase({
        categoryRepository: new CategoryRepository(),
        newRecordedDataQueue: new NewRecordedDataQueue()
      });
      const output = await createCategoryUsecase.execute(category);

      const inputDB = createCategoryMock.mock.calls[0][0];
      const inputQueue = sendMessageMock.mock.calls[0][0];

      expect(inputDB).toEqual(expect.objectContaining(category));
      expect(inputQueue.owner).toHaveLength(36);
      expect(output.errors).toHaveLength(0);
    });

    test('Não deve criar categoria já existente', async () => {
      const category: CreateCategoryInput = {
        owner: '123',
        title: 'Teste',
        description: 'Descrição da categoria 1'
      };

      const findCategoryByTitleMock = jest
        .spyOn(CategoryRepository.prototype, 'findCategoryByTitle')
        .mockImplementation(async () => [{}]);

      const createCategoryUsecase = new CreateCategoryUsecase({
        categoryRepository: new CategoryRepository(),
        newRecordedDataQueue: new NewRecordedDataQueue()
      });
      const output = await createCategoryUsecase.execute(category);

      expect(output.errors).toHaveLength(1);
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

      const createCategoryUsecase = new CreateCategoryUsecase({
        categoryRepository: new CategoryRepository(),
        newRecordedDataQueue: new NewRecordedDataQueue()
      });
      const output = await createCategoryUsecase.execute(category);

      expect(output.errors).toHaveLength(2);
    });

    test('Deve dar erro de valor excedido', async () => {
      const category: CreateCategoryInput = {
        owner: '123',
        title: faker.lorem.words({ min: 128, max: 128 }),
        description: faker.lorem.words({ min: 512, max: 512 })
      };

      const createCategoryUsecase = new CreateCategoryUsecase({
        categoryRepository: new CategoryRepository(),
        newRecordedDataQueue: new NewRecordedDataQueue()
      });
      const output = await createCategoryUsecase.execute(category);

      expect(output.errors).toHaveLength(2);
    });

    test.only('inserir na fila', async () => {
      await RabbitMQInstance.connect();
      const queue = new NewRecordedDataQueue();

      for (let index = 1; index <= 1000; index++) {
        await queue.sendMessage({ owner: 'owner ' + index });
        console.log(index);
        await sleep(1500);
      }

      expect(0).toHaveLength(0);
    });
  });
});
