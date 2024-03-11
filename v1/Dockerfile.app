FROM node:20.10.0-alpine3.18

WORKDIR /home/node/app

RUN apk update \
    && apk add wget curl git zsh \
    && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
    && curl -L git.io/antigen > antigen.zsh \
    # Install terraform
    && wget https://releases.hashicorp.com/terraform/1.7.2/terraform_1.7.2_linux_amd64.zip \
    && unzip terraform_1.7.2_linux_amd64.zip -d /bin \
    && rm terraform_1.7.2_linux_amd64.zip

COPY ./package.json ./package-lock.json ./

RUN npm ci 

COPY ./ ./

RUN chown -R node:node ./

USER node

CMD sleep inf
