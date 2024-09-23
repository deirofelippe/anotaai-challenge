# Como executar

- `make init-all`: subir os containeres da aplicação e de observabilidade

- `make app-producer`: acessar o container do producer
- `npm run dev`: iniciar o servidor
- `make logs-producer`: ver os logs do container do producer

- `make app-consumer`: acessar o container do consumer
- `npm run dev`: iniciar o servidor
- `make logs-consumer`: ver os logs do container do consumer

- `cd terraform`
- `terraform init`: inicia o ambiente do terraform e baixa o provider
- `terraform apply -auto-approve`: cria a infraestrutura

- `make k6-build`
- `make k6-run-bin`

- `aws --endpoint-url=http://localhost:4566 s3 rm s3://catalog-bucket --recursive`
- `aws --endpoint-url=http://localhost:4566 s3 ls s3://catalog-bucket`
- `terraform destroy -auto-approve`

- `http://localhost:4566/catalog-bucket`