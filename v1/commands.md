# Commands

## Operações

### POST category

db.catalog.insertOne({
"owner": "123",
"catalog": [
{
"category_title": "Computador",
"category_description": "Dispositivos para computador",
"itens": []
}
]
})

db.catalog.updateOne(
{ "owner": "123" },
{ $push: { catalog: {
"category_title": "Games",
"category_description": "Games",
"itens": []
}}})

### POST product

db.catalog.updateOne({ "owner": "123" }, { $push: { catalog: {
"category_title": "Games",
"category_description": "Games",
"itens": []
}}})

db.catalog.updateOne(
{ "owner": "123", catalog: { $elemMatch: { category_title: "Computador" } } }, 
    { $push: { "catalog.$.itens": {
"title": "Teste",
"description": "Placa de vídeo",
"price": 1699.99
} }}
)

### PUT category

### PUT product

### DELETE category

db.catalog.updateOne(
{ "owner": "123" }, 
{ $pull: {
    "catalog": {
        category_title: "Computador"
}}})

### DELETE product

db.catalog.updateOne(
{ "owner": "123" }, 
    { $pull: { "catalog.$[e].itens": {
        "title": "Teste"
    } 
} },
{arrayFilters:[{ "e.category_title": "Computador" }]} )

## Mongosh

show collections
show dbs

db.catalog.drop()

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

db.catalog.insertMany([
{
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
},
{
"owner": "456",
"catalog": [
{
"category_title": "Quero comprar",
"category_description": "Produtos no geral",
"itens": [
{
"title": "RTX 3060",
"description": "Placa de vídeo",
"price": 1699.99
},
{
"title": "Logitech MX Keys",
"description": "Teclado",
"price": 659.0
}
]
}
]
}
])

db.catalog.updateOne({ nome: "Teste" }, { $set: { ativo: true }})
db.catalog.updateMany({ }, { $set: { salario: 5000 }})

db.catalog.deleteOne({ nome: "Testando" })

db.catalog.find().pretty()
db.catalog.findOne({ owner: "123" })
db.catalog.findOne({ ativo: true }).count()
db.catalog.find({ salario: { $gt: 4000 } })
db.students.find({ experience: { $elemMatch: { duration: { $lte: 3 }} } })

db.catalog.createIndex({ nome: 1 })
db.catalog.getIndexes()
db.catalog.explain().find({ nome: "Teste" })
db.catalog.dropIndex("nome_1")

db.catalog.insertOne({
"owner": "123",
"catalog": [
{
"category_title": "Computador",
"category_description": "Dispositivos para computador",
"itens": []
}
]
})
db.catalog.insertOne({
"owner": "456",
"catalog": [
{
"category_title": "Quero comprar",
"category_description": "Produtos no geral",
"itens": [
{
"title": "RTX 3060",
"description": "Placa de vídeo",
"price": 1699.99
},
{
"title": "Logitech MX Keys",
"description": "Teclado",
"price": 659.0
}
]
}
]
})

db.catalog.updateOne({ "owner": "123" }, { $push: { catalog: {
"category_title": "Games",
"category_description": "Games",
"itens": []
}}})

db.catalog.updateOne(
{ "owner": "123", catalog: { $elemMatch: { category_title: "Computador" } } }, 
    { $push: { "catalog.$.itens": {
"title": "RTX 3060",
"description": "Placa de vídeo",
"price": 1699.99
} }}
)
db.catalog.updateOne(
{ "owner": "123", catalog: { $elemMatch: { category_title: "Games" } } }, 
    { $push: { "catalog.$.itens": {
"title": "STALKER 2",
"description": "FPS",
"price": 199.99
} }}
)
db.catalog.updateOne(
{ "owner": "123", catalog: { $elemMatch: { category_title: "Games" } } }, 
    { $push: { "catalog.$.itens": {
"title": "Red Dead Redemption 2",
"description": "TPS",
"price": 299.9
} }}
)
db.catalog.updateOne(
{ "owner": "123", catalog: { $elemMatch: { category_title: "Games" } } }, 
    { $push: { "catalog.$.itens": {
"title": "Teste",
"description": "TPS",
"price": 299.9
} }}
)

//apagou a categoria Games
db.catalog.updateOne(
{ "owner": "123", catalog: { $elemMatch: { category_title: "Games" } } }, 
    { $pull: { catalog: { itens: { title: "Teste" } } } } 
)
db.catalog.updateOne(
    { "owner": "123", catalog: { $elemMatch: { category_title: "Games" } } }, 
    { $pull: { "catalog.$.itens.$.title": "Teste" } }
)

gt
gte
lt
lte

set
push
inc {inc:{salario: 1000}} {inc:{salario: -1000}}
