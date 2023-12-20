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
**Feature Flags**

The application supports various functionalities that can be toggled using feature flags. These flags enable or disable specific features in the application. To configure these, set the appropriate environment variables in the .env file in your backend setup.

**Configuring Feature Flags**

1. Open .env file in the backend directory of the project.
2. Set the feature flags as needed. For example:
```ENABLE_JIRA_INTEGRATION=true```
This enables the Jira integration feature. Set it to false to disable the automatic creation of Jira tickets.

**Impact of Feature Flags**

The use of feature flags allows specific functionalities to be enabled or disabled, facilitating testing and feature-specific development:

- Jira Ticket Creation: Controlled by ENABLE_JIRA_INTEGRATION. When set to true, the application will create Jira tickets upon form submission. Set to false to prevent the generation of test data in your Jira project.

- Email Notification: Controlled by SEND_FORM_CONFIRMATION_EMAILS. When set to true, the application will send emails for draft submition and draft notifications. Set to false will turn this feature off.