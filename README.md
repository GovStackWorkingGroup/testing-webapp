# testing-webapp

Frontend web application for the GovStack test platform.

## Documentation

### Prerequisites

 * Node.js (Version 16 or greater)
 * Yarn

### Application configuration for development

To configure and run the application, navigate to project directory and run the following commands:

```
yarn install
yarn dev
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The application will run on localhost port 3003 by default.

### Build

To run build:

```
yarn build
```

### Tests

To run tests:

```
yarn test
```

### Lint

To run eslint:

```
yarn lint
```

### Docker

Application can be deployed in docker container by running

```shell
docker-compose up --build
```

or

```shell
 docker-compose up
```

## Less

Less (which stands for Leaner Style Sheets) is a backwards-compatible language extension for CSS.
Every `.less` file should be localized in the `styles` folder.

To run less-watch-compiler in terminal:
```
yarn less
```

## Backend 
Testing application has a simple backend written using express.js. 
A more detailed description of the backend's part can be found in `/server/README.md`. 

### Setup 
From the main directory (requires running mongoDB):

```bash
# Go to the directory
cd server/
# Use default environmental variables, which can be adjusted if necessary
mv .env.example .env
yarn install
yarn dev
```

Backend service and monogoDB are also setups automatically
during `docker-compose up --build` execution.

## Useful information

Below you will find all the guidelines.

### Translations rules

To ensure that the file with translation keys is properly organized, it is worth familiarizing yourself with its rules:

- JSON keys contain complete translation ID as string. The translation IDs use "." to structure the translations hierarchically

- keys should be added alphabetically

- use a `app.` prefix to store translations that are likely to be used throughout the application

- use `my_component.` prefix to store translations that are likely to be used only in this specific component

  example: `"my_component.custom_key"`

- develop a suitable naming scheme: snake_case

  example:
  `"app.page_not_found"`

- avoid duplication of translation keys

- remove unused translation keys

- avoid concatenating translations

## Git Flow in Our Project

We use the Git Flow branching model to organize our work:

- Main Branch (`main`)**: It represents the most stable version of our project, as it's used for production. Direct commits to this branch are not allowed; it's protected.

- Develop Branch (`develop`)**: It acts as an integration branch for features. All new features are branched off from `develop`. Direct commits to this branch are not allowed; it's protected.

- Feature Branches (`feature/*`)**: For new features or enhancements. Once development is done, they're merged back into `develop`.

- Release Branches (`release/*`)**: These are cut from `develop` when we're ready for a new production release. When the release is finalized, it's merged into both `main` and `develop`.

- Hotfix Branches (`hotfix/*`)**: These are created if there's a severe bug in the production version. They branch off from `main` and are merged back into both `main` and `develop` after the fix.

Naming Conventions:

- Feature Branches: `feature/ticket-ID` - Branches used for new features or enhancements, named according to the ticket or task ID.

- Release Branches**: `release/version` - Branches prepared for production releases, named by the release version.

- Hotfix Branches**: `hotfix/hotfix-name` - Branches used to quickly fix urgent issues in the production environment, named descriptively based on the nature of the hotfix.

Commit Message Convention:

- For each commit use format: `ticket_ID: brief description of the changes`

Remember, when creating a new branch, always pull the latest changes from the branch you're basing off to avoid conflicts.
