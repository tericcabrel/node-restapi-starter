FROM node:12.2.0-alpine

RUN mkdir -p /var/node-starter

RUN chmod -R 777 /var/node-starter

WORKDIR /var/node-starter
COPY . ./

RUN yarn --silent

RUN yarn add --global nodemon ts-node --silent

EXPOSE 7010

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && yarn start

# docker build -t node-starter:dev .
# docker run -v ${PWD}:/var/node-starter -v /var/node-starter/node_modules -p 7010:7010 --rm node-starter:dev
