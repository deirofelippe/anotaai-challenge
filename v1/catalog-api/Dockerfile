FROM node:20.15.0-alpine3.20

RUN apk update \
    && apk add wget curl git netcat-openbsd mtr \
    && echo "alias la='ls -lah'" >> /home/node/.ashrc 

USER node

WORKDIR /home/node/app

COPY --chown=node:node ./package.json ./package-lock.json ./

RUN npm ci 

COPY --chown=node:node ./ ./

CMD ["/usr/local/bin/npm", "start"]