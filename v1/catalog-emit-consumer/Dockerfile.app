FROM node:20.15.0-alpine3.20

WORKDIR /home/node/app

RUN apk update \
    && apk add wget curl git zsh 

RUN echo "alias la='ls -lah'" >> /home/node/.ashrc 

COPY ./package.json ./package-lock.json ./

RUN npm ci 

COPY ./ ./

USER node

CMD ["/usr/local/bin/npm", "run", "dev"]
