FROM node:20.15.0-alpine3.20

WORKDIR /home/node/app

RUN apk update \
    && apk add wget curl git netcat-openbsd mtr make \
    && echo "alias la='ls -lah'" >> /home/node/.ashrc \
    && chown node:node /home/node/app \
    && cd /tmp \
    #  instala o terraform
    && wget https://releases.hashicorp.com/terraform/1.9.7/terraform_1.9.7_linux_amd64.zip \
    && unzip terraform_1.9.7_linux_amd64.zip \
    && mv terraform /usr/local/bin/ \
    #  instala o kubernetes
    && wget "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && cd /home/node/app

COPY --chown=node:node ./ ./

USER node

CMD ["/bin/sleep", "inf"]

