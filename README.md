# testing-webapp

Frontend web application for the GovStack test platform.

## Documentation

### Frontend

## Adding Custom HTML Pages to Your Application

To customize the content of specific pages in your application, you can add your static HTML files to the `frontend/content/custom/` directory. This directory is mapped into the Docker container, allowing your application to access and serve these files at runtime. Each HTML file should be named according to the page it represents (e.g., `imprint.html` for the Imprint page).

If a custom HTML file is not provided in the `custom` directory, the application will automatically fall back to using the default template located in the `frontend/content/template/` directory. This ensures that your application can still display content even when custom pages are not available.

#### Prerequisites

- Node.js (Version 16 or greater)
- Yarn

#### Application configuration for front-end development

To configure and run the application, navigate to project directory - 'frontend' folder

```
cd frontend
```

#### Setup

Create an copy of example.env file.

```bash
# Use default environmental variables, which can be adjusted if necessary
mv .env.example .env
```

and run the following commands:

```
yarn install
yarn dev
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The application will run on localhost port 3003 by default.

#### Build

To run build:

```
yarn build
```

#### Tests

To run tests:

```
yarn test
```

#### Lint

To run eslint:

```
yarn lint
```

#### Docker

Application can be deployed in docker container by running

```shell
docker-compose up --build
```

or

```shell
 docker-compose up
```

#### Less

Less (which stands for Leaner Style Sheets) is a backwards-compatible language extension for CSS.
Every `.less` file should be localized in the `styles` folder.

To run less-watch-compiler in terminal:

```
yarn less
```

### Backend

Testing application has a simple backend written using express.js.
A more detailed description of the backend's part can be found in `/backend/README.md`.

#### Setup

From the main directory (requires running mongoDB):

```bash
# Go to the directory
cd backend/
# Use default environmental variables, which can be adjusted if necessary
mv .env.example .env
yarn install
yarn dev
```

Backend service and monogoDB are also setups automatically
during `docker-compose up --build` execution.


#Deployment

## 


### Useful information

Below you will find all the guidelines.

#### Translations rules

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


# Cloud Hosting Setup Guide

## Cloud Hosting
1. Select a suitable plan (e.g., CX22) based on your resource needs.
2. Operating System: Use Ubuntu 24.04 or similar.
3. Add SSH keys to authenticate users and allow them to deploy the application.

## Domain Name System (DNS)
1. Use a DNS provider to map IP with domain names.
2. Update DNS records to use new IP addresses:
   - `testing.govstack.global -> Server IP`
   - `api.testing.govstack.global -> Server IP`

## SSL
1. Set up an SSL/TLS certificate to use HTTPS instead of HTTP.

---

## Server Initial Setup
1. Connect to the server:
   ```bash
   ssh user@<your_server_ip>
   ```
2. Ensure that Docker and Docker Compose are installed:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install git docker docker-compose -y
   ```
3. Create the `/opt/` directory and fetch the `testing-webapp` repository from GitHub:
   ```bash
   mkdir -p /opt/
   cd /opt/
   ```
4. Clone the repository:
   ```bash
   git clone https://github.com/GovStackWorkingGroup/testing-webapp.git .
   ```

## Environment Configuration
1. Set up local `.env` files for `frontend` and `backend` directories:
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
2. Fill in the variables based on comments:
   - `Mongo_username`: root
   - For production, turn Jira config and email notifications to `true`.
   - Use GitHub for SSO for review users.
   - For EU operators: use an email service based in the EU.

---

## Deployment
### Using `deploy.sh` Script
1. Configure the script to match server credentials, e.g.:
   ```bash
   elif [ "${DEPLOY_ENV}" == "prod" ]; then
     DEPLOYMENT_USER="ubuntu"
     DEPLOYMENT_HOST="testing.govstack.global"
     BRANCH="main"
   else
   ```
2. Ensure your RSA key is set as default or specify it in the script:
   ```bash
   sudo ssh -i your_rsa_key
   ```

### Manual Deployment
1. Navigate to `/opt/testing-webapp` and run:
   ```bash
   git fetch
   git checkout main
   git reset --hard origin/main
   git pull origin main
   ```
2. Build and deploy using Docker Compose:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   docker image prune -f
   ```

---

## Verify Deployment
1. Check running containers:
   ```bash
   docker ps
   ```
2. Inspect logs if needed:
   ```bash
   docker logs <container_name>
   ```
   Example:
   ```bash
   docker logs testing-webapp-web-1
   docker logs testing-webapp-backend-1
   ```

---

## Testing
1. Verify the database connection with MongoDB.
2. Run backend tests.
3. Run frontend tests.
4. Use Postman to send requests to the API.

## Data Upload
1. Download from previous server: compliance forms, building block requirements and reports.
2. Save static folder `/uploads` that stores documentation and logos
3. Copy static pages to new instance

---

## QA / Common Issues
1. If set up with IP addresses, API may not be accessible on port 5000 without editing Nginx settings.
2. Domain names may take up to 24 hours to bind to IP addresses.
3. Changing domain names like `testing.govstack.global` requires updates in:
   - `docker-compose.yml`
   - `docker-compose.prod.yml`
4. If the application keeps loading, check the backend or database:
   - If the database has no records, it may display "Loading more data."
5. Do not use root as default user, change default passwords and API key

### Git Flow in Our Project

We use the Git Flow branching model to organize our work:

- Main Branch (`main`)\*\*: It represents the most stable version of our project, as it's used for production. Direct commits to this branch are not allowed; it's protected.

- Develop Branch (`develop`)\*\*: It acts as an integration branch for features. All new features are branched off from `develop`. Direct commits to this branch are not allowed; it's protected.

- Feature Branches (`feature/*`)\*\*: For new features or enhancements. Once development is done, they're merged back into `develop`.

- Release Branches (`release/*`)\*\*: These are cut from `develop` when we're ready for a new production release. When the release is finalized, it's merged into both `main` and `develop`.

- Hotfix Branches (`hotfix/*`)\*\*: These are created if there's a severe bug in the production version. They branch off from `main` and are merged back into both `main` and `develop` after the fix.

Naming Conventions:

- Feature Branches: `feature/ticket-ID` - Branches used for new features or enhancements, named according to the ticket or task ID.

- Release Branches\*\*: `release/version` - Branches prepared for production releases, named by the release version.

- Hotfix Branches\*\*: `hotfix/hotfix-name` - Branches used to quickly fix urgent issues in the production environment, named descriptively based on the nature of the hotfix.

Commit Message Convention:

- For each commit use format: `ticket_ID: brief description of the changes`

Remember, when creating a new branch, always pull the latest changes from the branch you're basing off to avoid conflicts.



