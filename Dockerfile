FROM node:20.15.0-alpine3.20

RUN apk update \
    && apk add wget curl git netcat-openbsd mtr make \
    && echo "alias la='ls -lah'" >> /home/node/.ashrc \
    && cd /tmp \
    #  instala o terraform
    && wget https://releases.hashicorp.com/terraform/1.9.7/terraform_1.9.7_linux_amd64.zip \
    && unzip terraform_1.9.7_linux_amd64.zip \
    && mv terraform /usr/local/bin/ 

USER node

WORKDIR /home/node/app

COPY --chown=node:node ./ ./

CMD ["/bin/sleep", "inf"]

