FROM node:18-alpine as build-stage

WORKDIR /usr/service

COPY ["package.json", "package-lock.json*", "./"]

COPY . .

RUN npm ci

FROM node:18-alpine

EXPOSE ${PORT}

WORKDIR /usr/service

COPY --from=build-stage /usr/service .

CMD ["npm", "run", "start:dev"]