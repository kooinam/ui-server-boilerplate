FROM node:boron
ARG id_rsa
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN mkdir /root/.ssh
RUN echo "Host bitbucket.org\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config
RUN echo "$id_rsa" >> /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN yarn
COPY . .
RUN yarn build
EXPOSE 8000
CMD [ "yarn",  "start:production" ]