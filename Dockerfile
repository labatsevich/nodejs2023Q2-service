FROM node:18-alpine as build-stage

WORKDIR /usr/service

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

EXPOSE 4000

CMD [ "npm", "run", "start" ]
