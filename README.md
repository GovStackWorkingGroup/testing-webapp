# testing-webapp
Frontend web application for the GovStack test platform.

## Documentation

## Prerequisites

 * Node.js (Version 16 or greater)
 * Npm

## Application configuration for development 

To configure and run the application, navigate to project directory and run the following commands:

 * yarn install
 * yarn dev

 This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The application will run on localhost port 3003 by default.

## Build

To run build:

* yarn build

## Tests

To run tests:

* yarn test

## Lint

To run eslint:

* yarn lint

## Docker

Application can be deployed in docker container by running
```shell
docker-compose up --build 
```
or 
```shell
 docker-compose up
```