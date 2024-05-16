#

./init-all
make app-producer
npm run dev
make app-consumer
npm run dev
cd terraform
terraform init
terraform apply -auto-approve
cd scripts-k6
./k6 run script.js

aws --endpoint-url=http://localhost:4566 s3 rm s3://catalog-bucket --recursive
aws --endpoint-url=http://localhost:4566 s3 ls s3://catalog-bucket
terraform destroy -auto-approve
