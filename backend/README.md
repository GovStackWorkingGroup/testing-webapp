# Testing app backend 

Express.js server provides access to report results. 

---
## Requirements
- Node.js (Version 18 or greater)
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
* `MONGO_PASSWORD`
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

## Running Tests
    $ yarn test

## MongoDB Storage Format

The MongoDB database for this application stores several types of documents, each serving a distinct purpose. Below is an overview of the main collections and their structures:

### 1. Report for BB Test Harness
- Collection: `bbTestHarnessReports`
- Document Structure:
  - `productMetaData`: Object containing metadata about the product being tested.
  - `start`: Object indicating the start of the test.
  - `finish`: Object indicating the end of the test.
  - `testCases`: Array of test cases, each representing a specific test performed (e.g., 43 test cases).
  - `saveTime`: Timestamp indicating when the report was saved (e.g., `1694113491796`).
  - `buildingBlock`: Name of the building block being tested (e.g., `bb-digital-registries`).
  - `testSuite`: The test suite used (e.g., `openAPI`).
  - `testApp`: The testing application/tool used (e.g., `mockoon`).
  - `sourceBranch`: The source branch in the repository (e.g., `main`).
  - `version`: Version of the product or building block being tested (e.g., `v7.3.121`).
  - `__v`: Version key set by MongoDB.

### 2. Compliance Documents for Compliance Form
- Collection: `complianceDocuments`
- Document Structure:
  - `_id`: Unique identifier for the document (e.g., `658f02221e7612c33583b4c6`).
  - `softwareName`: Name of the software (e.g., `openIMIS`).
  - `logo`: URL to the software's logo (e.g., `https://openIMIS.com/logo.png`).
  - `website`: URL to the software's website (e.g., `https://openIMIS.com`).
  - `documentation`: URL to the software's documentation (e.g., `https://openIMIS.com/doc1`).
  - `pointOfContact`: Contact email (e.g., `contact@openIMIS.com`).
  - `status`: Status code (e.g., `0`).
  - `uniqueId`: Unique ID for the compliance document (e.g., `34e7dfbf-5de0-4146-8946-387135333bb8`).
  - `expirationDate`: Expiration date of the document (e.g., `2024-11-24T00:00:00.000Z`).
  - `description`: Description of the software.
  - `deploymentCompliance`: Object containing detailed compliance information.

### 3. BB Requirements
- Collection: `bbRequirements`
- Document Structure:
  - `bbName`: Name of the building block (e.g., "Cloud Infrastructure Hosting").
  - `bbKey`: Unique key identifier for the building block (e.g., "bb-cloud-infrastructure-hosting").
  - `bbVersion`: Version of the building block (e.g., "Development").
  - `dateOfSave`: Timestamp indicating when the document was saved (e.g., `2023-12-08T11:23:25.980+00:00`).
  - `requirements`: Object containing the specific requirements for the building block.
  - `__v`: Version key set by MongoDB.

## Endpoints

### Compliance Reports
- `GET /compliance/list`
  - Lists all compliance forms with a count, showing forms with status IN_REVIEW, ACCEPTED, and REJECTED for authenticated users, and IN_REVIEW, ACCEPTED for others.
  - Middleware: `limiter`, `verifyOptionalGithubToken`, `PaginationMiddleware.handlePaginationFilters`.

- `GET /compliance/:softwareName/detail`
  - Provides detailed information about a specific software by its name, including basic info such as _id, softwareName, compliance status, logo, website, documentation, pointOfContact.
  - Middleware: `limiter`.

- `GET /compliance/forms/:id`
  - Returns detailed information about a compliance form by its ID, including interface compliance and requirement specification compliance for each building block.
  - Middleware: `limiter`.

- `GET /compliance/drafts/:id`
  - Similar to the above endpoint, but specifically for drafts, identified by UniqueID.
  - Middleware: `limiter`.

### Building Block Requirements
- `GET /compliance/requirements`
  - Lists all requirements for building blocks.
  - Middleware: `limiter`.

- `GET /compliance/requirements/:bbKey`
  - Lists requirements for a specific building block identified by `bbKey`.
  - Middleware: `limiter`.

- `GET /compliance/bbs`
  - Lists all available building blocks.
  - Middleware: `limiter`.

### Drafts and Form Submission
- `POST /compliance/drafts`
  - Creates a new draft form.
  - Middleware: `limiter`, `filesUpload`.

- `POST /compliance/drafts/submit`
  - Submits a draft form, changing its status from DRAFT to IN_REVIEW.
  - Middleware: `limiter`.

### Form Review and Modification
- `PATCH /compliance/forms/:id/accept`
  - For reviewers, accepts a form, changing its status to ACCEPTED and adds review information.
  - Middleware: `limiter`, `verifyGithubToken`.

- `PATCH /compliance/forms/:id/reject`
  - For reviewers, rejects a form, setting its status to REJECTED.
  - Middleware: `limiter`, `verifyGithubToken`.

- `PATCH /compliance/forms/:id/update`
  - Allows reviewers to update a form without changing its status.
  - Middleware: `limiter`, `verifyGithubToken`.

- `PATCH /compliance/drafts/:draftId`
  - Allows editing of a draft. Note that this will overwrite the entire field being edited.
  - Middleware: `limiter`, `filesUpload`.

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