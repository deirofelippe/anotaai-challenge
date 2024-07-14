#

./init-all

make app-producer
npm run dev
make logs-producer

make app-consumer
npm run dev
make logs-consumer

cd terraform
terraform init
terraform apply -auto-approve

make k6-build
make k6-run-bin

aws --endpoint-url=http://localhost:4566 s3 rm s3://catalog-bucket --recursive
aws --endpoint-url=http://localhost:4566 s3 ls s3://catalog-bucket
terraform destroy -auto-approve

http://localhost:4566/catalog-bucket