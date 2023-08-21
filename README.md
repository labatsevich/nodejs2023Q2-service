# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

Command (docker scan) won't work if you are using latest docker ver. My docker version is 4.4 and this command works well. Sorry for this!  

I forgotten to do it myself. Thanks for understanding!

## Downloading

```
git clone https://github.com/labatsevich/nodejs2023Q2-service.git
```

## Change branche

```
git checkout logger_and_auth
```

## Using .env file

```
rename .env.example to .env
```

## Build images

```
npm run docker:build
```

## Starting container

This command starts one by one command docker-compose up, npx prisma migrate dev --name init & nest start --watch

```
npm run docker:up
```
After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Authentication

```
/auth/signup - creane new user
```
```
/auth/login - to get access_token. After, copy it and use for testing api
```
## Testing

After application running and you  open new terminal and enter:

```
npm run test:auth
```
