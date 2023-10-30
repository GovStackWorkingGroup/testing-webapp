# Testing app backend 

Express.js server provides access to report results. 

---
## Requirements
- Node.js (Version 16 or greater)
- Yarn (Version 1.22.5 or greater)
- Mongo (Version 5.2 or greater)

## Install
```bash 
$ yarn install
```

## Configure app
Application setup is done through environmental variables. 
The following variables are used:

### Connection with MongoDB
* `MONGO_USERNAME`
* `MONGO_PASSOWORD`
* `MONGO_HOST`
* `MONGO_PORT`
* `MONGO_DATABASE`
* `MONGO_CONNECTION_OPTIONS`

Are used to create mongodb connection url.

### Access restriction
* `API_KEY_*`

Env variables that regex matches `API_KEY_*` pattern are used to determine lists of API keys authorized to push report results to the storage. API keys have to be passed as an `x-api-key` header in incoming requests.

### Other 
* `PORT`

By default, application runs on port `5000`.

## Running the project

    $ yarn dev

Uses `nodemon` for hot reload.

## Simple build for production

    $ yarn build

## MongoDB
[To Be added; Information about storage format]

## Endpoints
[To Be added; ]