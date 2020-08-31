FROM node:13-alpine
MAINTAINER EdustripeDev <edustripedev@gmail.com>
# Update and install packages
RUN apk update
RUN apk add --update git zip vim wget unzip curl nginx python3 py3-pip yarn bash

# Install awscli using pip
RUN pip3 install awscli --upgrade

# prepare a user which runs everything locally!
RUN adduser --disabled-password -s /bin/bash edustripe

COPY ./arch/scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY ./arch/scripts/repo.sh /usr/local/bin/repo.sh

RUN chmod +x /usr/local/bin/repo.sh && chmod +x /usr/local/bin/entrypoint.sh

#set the terminal to xterm
RUN export TERM=xterm

WORKDIR /var/www

CMD ["entrypoint.sh"]
