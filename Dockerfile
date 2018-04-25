FROM node:boron
ARG id_rsa
WORKDIR /usr/src/app
COPY . .
RUN mkdir /root/.ssh && echo "Host bitbucket.org\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config && echo "$id_rsa" >> /root/.ssh/id_rsa && chmod 700 /root/.ssh/id_rsa && yarn && yarn build
EXPOSE 8002
CMD [ "yarn",  "start:production" ]