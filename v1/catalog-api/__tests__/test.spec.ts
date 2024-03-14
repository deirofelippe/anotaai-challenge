// import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
// const catalogSchema = new Schema({
//   owner: String,
//   catalog: [
//     {
//       category_title: String,
//       category_description: String,
//       itens: [
//         {
//           title: String,
//           description: String,
//           price: Number
//         }
//       ]
//     }
//   ]
// });

import { MongoInstance } from '../src/MongoInstance';

// const catalogModel = mongoose.model('Catalog', catalogSchema);

// export { catalogModel };

describe('', () => {
  beforeAll(async () => {
    await MongoInstance.connect();
  });

  // afterAll(async () => {
  //   await MongoInstance.close();
  // });

  describe('Erros', () => {
    test.skip.each([
      { owner: '', title: 'Teste' },
      { owner: 'Teste', title: '' },
      { owner: '', title: '' }
    ])('Deve dar erro na validação da categoria', ({ owner, title }) => {
      const input = {
        owner,
        title,
        description: 'Teste Descrição'
      };

      // const result = await createCategory(input);

      // expect(result.errors).haveLength(1);
    });
  });

  describe('', () => {
    beforeEach(async () => {
      const catalog = [
        {
          owner: '123',
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
            },
            {
              category_title: 'Games',
              category_description: 'Games',
              itens: [
                {
                  title: 'STALKER 2',
                  description: 'FPS',
                  price: 199.99
                },
                {
                  title: 'Red Dead Redemption 2',
                  description: 'TPS',
                  price: 299.9
                },
                {
                  title: 'Teste',
                  description: 'TPS',
                  price: 299.9
                }
              ]
            }
          ]
        },
        {
          owner: '456',
          catalog: [
            {
              category_title: 'Quero comprar',
              category_description: 'Produtos no geral',
              itens: [
                {
                  title: 'RTX 3060',
                  description: 'Placa de vídeo',
                  price: 1699.99
                },
                {
                  title: 'Logitech MX Keys',
                  description: 'Teclado',
                  price: 659.0
                }
              ]
            }
          ]
        }
      ];

      await MongoInstance.getInstance()
        .collection('catalog')
        .insertMany(catalog);
    });

    beforeEach(async () => {
      await MongoInstance.getInstance().collection('catalog').drop();
    });

    test('Deve criar categoria', async () => {
      const category = {
        owner: '123',
        title: 'Games',
        description: 'Descrição da categoria 1'
      };

      await createCategoryUsecase(category);

      expect('teste').toEqual('teste');
    });
  });
});

type Category = {
  owner: string;
  title: string;
  description: string;
};

async function createCategoryUsecase(input: Category) {
  // CreateCategoryUsecaseValidate

  const ownerFound = await findOwner({
    owner: input.owner
  });

  if (ownerFound) {
    const categoryFound = await findOwnerCategory({
      category_title: input.title,
      owner: input.owner
    });

    if (categoryFound) {
      return 'owner já possui a categoria';
    }

    await createCategory({
      category_title: input.title,
      category_description: input.description,
      owner: input.owner
    });
  } else {
    await createOwnerAndCategory({
      category_title: input.title,
      category_description: input.description,
      owner: input.owner
    });
  }
}

async function findOwnerCategory(input: {
  category_title: string;
  owner: string;
}): Promise<any[]> {
  const db = MongoInstance.getInstance();

  return db
    .collection('catalog')
    .find({
      owner: input.owner,
      'catalog.category_title': input.category_title
    })
    .toArray();
}

/*
atualizar os dados de produto ou categoria
deletar produto ou categoria do meu catalogo
produto é associado a uma categoria por vez
produto e categoria pertence a somente um owner
dois owner podem possuir categorias de mesmo nome, mas cada um com a sua
*/
