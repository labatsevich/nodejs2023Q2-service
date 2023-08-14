# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/labatsevich/nodejs2023Q2-service.git
```

## Change branche

```
git checkout containerization
```

## Using .env file

```
rename .env.example to .env
```

## Build images

```
run npm run docker:build
```

## Start container

This command starts one by one command docker-compose up, npx prisma migrate dev --name init & nest start --watch

```
run npm run docker:up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```