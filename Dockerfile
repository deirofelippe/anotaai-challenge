FROM node:20.15.0-alpine3.20

WORKDIR /home/node/app

RUN apk update \
    && apk add wget curl git netcat-openbsd mtr \
    && echo "alias la='ls -lah'" >> /home/node/.ashrc \
    && chown node:node /home/node/app

COPY --chown=node:node ./ ./

USER node

CMD ["/bin/sleep", "inf"]
