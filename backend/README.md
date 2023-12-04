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

## Environment Configuration
**Development Mode**

Application supports a development mode which alters its behavior for testing and development purposes. To enable this mode, a specific environment variable needs to be set in the .env file of your backend setup.

**Setting Development Mode**

Open .env file in the backend directory of the project.
Add the following line to the file:
```BE_DEVELOPMENT_MODE=true```
This sets the application in development mode. Set it to false or remove it to run the application in production mode.

**Impact of Development Mode**

When the application is in development mode, certain features are modified or disabled to facilitate testing and development:

- Jira Ticket Creation: The application will skip the creation of Jira tickets when forms are submitted. This prevents the generation of test data in your Jira project.
