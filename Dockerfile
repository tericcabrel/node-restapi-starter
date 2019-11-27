FROM node:12.2.0-alpine
RUN mkdir -p /var/node-starter
RUN chmod -R 777 /var/node-starter
WORKDIR /var/node-starter
COPY . ./
ENV NODE_ENV=development
RUN yarn --silent
RUN yarn add --global nodemon ts-node --silent
EXPOSE 7010
CMD ["yarn", "start"]

# docker build -t node-starter:dev .
# docker run -v ${PWD}:/var/node-starter -v /var/node-starter/node_modules -p 7010:7010 --rm node-starter:dev
