FROM node:20.10.0-alpine3.18

WORKDIR /home/node/app

RUN apk update \
    && apk add wget curl git

# Install terraform
RUN wget https://releases.hashicorp.com/terraform/1.7.2/terraform_1.7.2_linux_amd64.zip \
    && unzip terraform_1.7.2_linux_amd64.zip -d /bin \
    && rm terraform_1.7.2_linux_amd64.zip

COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY ./ ./

CMD tail -f /dev/null

USER node

