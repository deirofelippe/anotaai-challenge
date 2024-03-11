# Anotaai Challenge

## User stories

- Criar produto junto com seu owner
- Criar categoria junto com seu owner
- Associar um produto a uma categoria por vez
- Atualizar os dados do produto e da categoria
- Produtos e categoria pertencem a somente um owner
- Haverá multiplas requisições por segundo para editar produtos/categorias, e também busca por categoria
- Se houver mudança no catalogo de produto (produto e categoria), deverá ser publicada essa mudança no tópico "catalog-emit" no SQS ou RabbitMQ
- Consumidor que ouve as mudanças no catalogo para um owner especifico
- Quando o consumer receber a mensagem, busca no banco pelo catalogo do owner, gera um catalogo em json, publica o json no S3

- Product: title, description, price, category, owner ID
- Category: title, description, owner ID

## Ferramentas

SNS SQS S3
RabbitMQ
MongoDB
Docker
K6
Terraform
Localstack
Nginx
Nodejs Typescript Express

Camadas
Variáveis de ambiente
Testes de unidade
Logs
Error handling
Documentação (como executar, swagger, c4 model)
Organização de código, separação de modulo, comentários,
Histórico de commits

## Outros

