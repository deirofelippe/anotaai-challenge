# Commands Mongosh

docker compose exec -it mongodb mongosh -u mongodb -p password --host mongodb

## Operações

db.catalog.drop()
show collections
show dbs

db.catalog.deleteOne({ nome: "Testando" })

db.catalog.find().pretty()
db.catalog.findOne({ ativo: true }).count()

db.catalog.createIndex({ nome: 1 })
db.catalog.getIndexes()
db.catalog.explain().find({ nome: "Teste" })
db.catalog.dropIndex("nome_1")

### Inserir

db.catalog.insertOne({
    "owner": "123",
    "catalog": [
        {
            "category_title": "Computador",
            "category_description": "Dispositivos para computador",
            "itens": [
                {
                    "title": "RTX 3060",
                    "description": "Placa de vídeo",
                    "price": 1699.99
                },
                {
                    "title": "Ryzen 5 5600X",
                    "description": "Processador",
                    "price": 1039.99
                }
            ]
        },
        {
            "category_title": "Games",
            "category_description": "Games",
            "itens": [
                {
                    "title": "STALKER 2",
                    "description": "FPS",
                    "price": 199.99
                },
                {
                    "title": "Red Dead Redemption 2",
                    "description": "TPS",
                    "price": 299.9
                },{
                    "title": "Teste",
                    "description": "TPS",
                    "price": 299.9
                }
            ]
        }
    ]
})

### Buscar

db.catalog.find({ owner: "123" })

db.catalog.find().count()

db.catalog.find(
    { owner: "123" },
    {
        "owner": 1,
        "catalog.category_title": 1,
        "catalog.itens.title": 1,
        "catalog.itens.price": 1,
    }
)

db.catalog.find({ 
    "owner": "321",
    "catalog.category_title": "Teste"
})

db.catalog.find({ 
    "owner": "321",
    "catalog.category_title": "Teste",
    "catalog.itens.title": "STALKER 2"
})

### Adiciona produto na categoria do catalogo do owner

db.catalog.updateOne({
    "owner":"321"
},{
    "$push":{
        "catalog.$[e1].itens": {
            "title": "STALKER 2",
            "description": "FPS",
            "price": 199.99
        }
    }
},{
    arrayFilters: [
        { "e1.category_title": "Teste" }
    ]
})

### Adiciona categoria no catalogo do owner

db.catalog.insertOne({
    "owner": "321",
    "catalog": [{
        "category_title": "Teste",
        "category_description": "Teste",
        "itens": []
    }]
})

db.catalog.update({
    "owner":"321"
},{
    "$push":{
        "catalog": {
            "category_title": "Teste2",
            "category_description": "Teste",
            "itens": []
        }
    }
})

### Atualiza campo do produto

db.catalog.update({
    "owner":"1234",
    "catalog.itens.title": "Red Dead Redemption 2"
},{
    "$set":{
        "catalog.$[].itens.$[].price": 300.10
    }
})

### Atualiza campo da categoria

db.catalog.update({
    "owner":"1234",
    "catalog.category_title": "Games"
},{
    "$set":{
        "catalog.$[].category_title": "Game"
    }
})

### Deleta produto da categoria

db.catalog.update({
    "owner":"1234",
    "catalog.category_title":"Games",
},
{
    "$pull":{
        "catalog.$[].itens": {
            "title": "STALKER 2" 
        }
    }
})

### Deleta categoria do catalogo

db.catalog.update({
    "owner":"1234"
},
{
    "$pull":{
        "catalog": {
            "category_title": "Computador" 
        }
    }
})

## 
