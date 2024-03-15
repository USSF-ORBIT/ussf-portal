# Development

1. [Environment Setup](#environment-setup)
1. [yarn scripts](#yarn-scripts)
1. [Running the application](#running-the-application)
1. [Working on an issue](#working-on-an-issue)
1. [Database migrations](#database-migrations)
1. [PR linting](#pr-linting)
1. [Testing](#testing)
1. [Apollo Server Explorer](#apollo-server-explorer)
1. [Launch Darkly](#launch-darkly)
1. [Releasing](#releasing)

## Environment Setup

The portal environment is composed of multiple repositories in a modular architecture (see [ADR-0002](adr/0002-nextjs.md), [ADR-0006](adr/0006-use-keystone-cms.md), and [ADR-0011](adr/0011-separate-repo-for-e2e-tests.md) for more details). 
For a high-level look of how the system is architected, review the following diagrams. Note: You will need to be a member of the GitHub organization to have access.

* [SAML Auth Flow](https://github.com/USSF-ORBIT/spacecadets-dev/blob/d728708977d694428ee0d25598efbba706caaf2d/docs/diagrams/app-engineering/auth_flow.png) 🔒
* [App Architecture](https://github.com/USSF-ORBIT/spacecadets-dev/blob/d728708977d694428ee0d25598efbba706caaf2d/docs/diagrams/app-engineering/app_architecture.png) 🔒


### Pre-requisites

1. **Clone all required repositories into a shared directory on your local machine**

   - Repositories:
     - (Required) [USSF Portal Client](https://github.com/USSF-ORBIT/ussf-portal-client)
     - (Required) [USSF Portal CMS](https://github.com/USSF-ORBIT/ussf-portal-cms)
     - [USSF Analytics](https://github.com/USSF-ORBIT/analytics)
     - [USSF Personnel API](https://github.com/USSF-ORBIT/ussf-personnel-api)
     - [USSF Third Party API](https://github.com/USSF-ORBIT/ussf-portal/tree/main/test-jwt-service)
   - Some scripts rely on the **Client** and **CMS** repos being present. It is assumed that they are checked out at the same level as this `ussf-portal` repo and have the default names `ussf-portal-client` and `ussf-portal-cms`.

2. **Set up [direnv](https://direnv.net/docs/hook.html)**

   - We're using direnv to manage environment variables.
   - You'll have to type `direnv allow` in your shell to load environment variables when they change, and when navigating into a project directory.

3. **Install [Docker](https://www.docker.com/products/docker-desktop)**

   - We're using Docker for local development, and to build & run the application in production.
   - Since we are _not_ using Docker as a full development environment, you will still need to check your node version and install packages (in order to do things like run tests, linting, Storybook, etc. on your local machine).

4. **Check your node version: `node -v`**

   - Make sure you are using the version of node specified in `.node-version`.
   - We recommend using [nodenv](https://github.com/nodenv/nodenv) to install and manage node versions.

5. **Use [yarn v1](https://classic.yarnpkg.com/lang/en/) to manage JS packages**

   - [Install yarn](https://classic.yarnpkg.com/en/docs/install) if you do not already have it.
   - Type `yarn` or `yarn install` inside the project directory to install dependencies. You will need to do this once after cloning the project, and continuously if the dependencies in `package.json` change.
   - 
6. **(Optional) Postgres**

   - To run Keystone locally, you will also need a [Postgres](https://www.postgresql.org/download/) instance running. 
     - Alternately, you can run `yarn services:up` which starts all required services in Docker, including Postgres.
  
### Environment variables

Most environment variables are already set in `.envrc` and only need to be added to your local file if you want to override the defaults. For more information, see [`environment-variables.md`](./development/environment-variables.md)


## yarn scripts

Most commonly used during development:

- `yarn services:up`: Starts all required services in Docker
  - Stop containers with `yarn services:down`
- `yarn cms:up`: Starts all required services _and_ Keystone CMS in Docker
  - Stop containers with `yarn services:down`
- `yarn portal:up`: Starts all services, Client, _and_ Keystone CMS in Docker
  - Stop containers with `yarn services:down`
  - Builds Client up to `e2e` stage. If you want to build the `runner` stage that is present in Production, you need to have a checksum file for verifying DoD PKI CA Certificates used in C1. Find these in the 1Password vault, create a file `dod_ca_cert_bundle.sha256` in `scripts/`, and paste the checksums there.
- `yarn dev`: Starts NextJS server in development mode and watches for changed files
- `yarn storybook`: Starts the Storybook component library on port 6006
- `yarn test`: Run Jest unit tests.
  - Run in watch mode with `yarn test:watch`
- `yarn services:removeall`: Will force remove all running and stopped containers

To start the app server as it will run in production:

- `yarn build`: Builds the NextJS production asset bundle
- `yarn start`: Starts the NextJS server in production mode

Other:

- `yarn format`: Autoformat all code using Prettier
- `yarn lint`: Runs the TypeScript compiler and ESLint and outputs issues
- `yarn storybook:build`: Build Storybook to a static site that can be deployed
- `yarn build:analyze`: Builds the asset bundle and generates webpack stats files

## Running the application

### Development Mode

The `yarn dev` command starts the NextJS dev server at `localhost:3000`. This command will automatically watch for changes to files, and re-compile/reload the browser window. This is usually what you'll have running during active development.

### Production Mode

_Not to be confused with the production environment!_

You can start the NextJS server in "production mode" (i.e., the server will run in the same way it will on a deployed environment with no recompilation or hot reloading) by running both:

- `yarn build` builds static assets that will be served by NextJS. This command must be used before `yarn start`.
- `yarn start` starts the NextJS server running at `localhost:3000` (the same port used by the dev server).

### Running in Docker

There are two separate Dockerfiles: `Dockerfile.dev`, which is used for running a local dev environment, and `Dockerfile`, which builds the production-ready image.

### Local Development with Docker

You can spin up your Docker environment using Docker Compose. By running `yarn services:up`, it will use `docker-compose.services.yml` to create and run the services required for development. This _does_ include Matomo (our analytics platform) for convienience though Portal does not require it to run.

Services include:

1. MongoDB

- Uses official MongoDB image v4.0.0
- exposed on port `:27017`
- initalizes `dev` database
- persists volume `portal_data`

2. Mongo Express

- In-browser GUI for MongoDB
- access on `localhost:8888`

3. Test SAML Identity Provider

- Service for testing auth flow
- Access on `localhost:8080`
- Log in with test user credentials:
  - username: user1
  - password: user1pass
- Additional users can be configured in the `users.php` file

4. Redis

- Uses official Redis v6.0.0
- Used to store session information

5. Postgres

- Stores Keystone CMS data
- Persists volume `cms_data`

6. Matomo

- Tracks Portal user events
- Uses Dockerfile from our [analytics repo](https://github.com/USSF-ORBIT/analytics) which should be checked out in  `../analytics/`.
- Depends on mariadb
- Persists volume `matomo_data`
- Access at `http://localhost:8081`
- Do not use `https` locally as the Matomo image is not setup for that locally
- Credentials are in the 1Password Vault 


7. MariaDB
- Stores Matomo Data
- Persists volume `mariadb_data`

8. Test JWT Issuer
- Creates a valid JSON Web Token to use for auth-protected queries and mutations for the Third-Party API
  - This API exposes Keystone and Portal data to other USSF apps such as Guardian One
- Code for this service lives in the `ussf-portal` repo in the `test-jwt-service` directory.
- Uses Dockerfile located in `ussf-portal/test-jwt-service/Dockerfile`
- Requires environment variable named `JWT_DEV_CERT` located in `ussf-portal/e2e/.envrc.local` (You will need to create this file initially.) 
  - The value for this variable can be found in the 1Password Vault under 'Test JWT Server Certs for Dev'
- Requires DoD certs to run e2e tests locally
  - In `ussf-portal-client`, create the file `scripts/dod_ca_cert_bundle.sha256`
  - In 1Password vault, locate `DoD PKI CA Cert Bundle SHA256 Checksums` and copy the data for the latest version
  - Paste the checksums in the `dod_ca_cert_bundle.sha256` file and save.


To run the app in detached development mode (with hot reloading):

```
docker compose up -d

```

Once services are running, start the NextJS app with `yarn dev`.

### Local Development with Keystone CMS

You can also use Docker Compose to spin up all services plus the external Keystone CMS by running `yarn cms:up`. This will start all above services plus Keystone, which can be accessed at `localhost:3001`.

#### Additional Keystone CMS commands 
- Run required services (`yarn services:up`)
- Run Keystone in dev mode (`yarn dev`)
- Run portal client (`cd ../ussf-portal-client && yarn dev`)

_or_

- Build Keystone Docker image:
  - `docker build -t keystone .`
- Run Docker image:
  - `docker run -p 3000:3000 --env SESSION_SECRET=$SESSION_SECRET --env DATABASE_URL=$DATABASE_URL keystone`

### MongoDB in Docker

On first creation of the MongoDB container, it will initialize a database as specified in `docker-compose` environment variables.

```
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - MONGODB_DB=dev
```

To **reset the database**:

```
yarn services:down

# Remove mounted volume for db
docker volume rm ussf-portal-client_portal_data

yarn services:up
```

### Client in a docker container locally for debugging deployment issues

If you want to run all services in docker to mimic a deployed environment as close as possible you can do this as described below.

- Ensure you have the latest version of the images built
  - Run `docker compose build`
- Ensure no other `yarn dev` is running in this repo or cms repo
- Run `yarn portal:up` will start everything
  - Client will be at http://localhost:3000
    - See [note about how to build the production stage of this container.](#yarn-scripts)
  - CMS will be at http://localhost:3001
- You can check things are running with `docker compose ps`
- You can follow the logs with `docker compose logs -f`
- Run `yarn services:down` to shut everything down

### Known limitations

- If a change is made to package.json, you'll need to shut down the environment and rebuild the app image using `docker compose up --build`

## Working on an issue

To begin working on an issue, make sure you've assigned yourself to the issue in [Shortcut](https://app.shortcut.com/orbit-truss) and marked it as "In Progress.".

Once you have an issue to work on, create a new branch off `main` using the naming convention:

`sc-{issue #}-{short description}`

For example: `sc-112-logo-component`

We have a pre-commit hook set up using Husky to run on staged files only. This will run [Prettier](https://prettier.io/), [TypeScript compilation](https://www.typescriptlang.org/) and [eslint](https://eslint.org/) and fail on errors. For an optimal developer experience, it's recommended that you configure your editor to run linting & formatting inline.

When your branch is ready, open a PR against `main`, fill out the description and request code reviews. The code must pass the same linting and formatting checks mentioned above, as well as [Jest tests](https://jestjs.io/) in order to merge.

## Database migrations
- [MongoDB Migrations for the Portal Client](development/mongo-db-migrations.md)
- [Postgres Migrations for Keystone CMS](development/postgres-migrations.md)


## PR linting

In order to easily maintain a clear changelog, we require all PRs into the `main` branch to pass the [conventional commits spec](https://www.conventionalcommits.org/en/v1.0.0/#specification).

The format for PR commits is:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed `type`s are:

- `build`: Changes that affect the build system or external dependencies (example scopes: webpack, npm)
- `chore`: Completing a task that has no effective code changes, such as updating the version and changelog for a release
- `ci`: Changes to our CI configuration files and scripts (example scopes: Circle, Github actions/workflows)
- `dev`: A code change that does not result in a user-facing feature (for example, a new component that is only visible in Storybook, or work that builds towards but does not complete a feature)
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: If the commit reverts a previous commit, it should begin with `revert:` , followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests

### `scope` is optional, and can be used to provide additional context, especially if changes only encompass a specific area of the code. Some examples include:

- `deps`: Updating a package listed in dependencies
- `deps-dev`: Updating a package listed in devDependencies
- `jest`: Changes to Jest tests
- `cypress`: Changes to Cypress tests
- `storybook`: Changes to Storybook or stories files only

### `body`:

Will default to a list of included commits since PRs are all squashed when merging. You can choose to keep or remove this list, and also add additional context to the body if needed.

### `footer`:

Should link the PR to any issues it closes (see: ["Linking a pull request to an issue"](https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue)).

Example:

```
Closes #123
```

The footer should also include `BREAKING CHANGE:` if the commit includes any breaking changes. This will make sure the major version is automatically bumped when this commit is released.

## Testing

### User Testing
  - [Logging in to the portal](./development/logging-in.md)

### Unit Tests (Jest)

- Use [Jest](https://jestjs.io/) to write unit tests for JavaScript code & React components that will be run in [jsdom](https://github.com/jsdom/jsdom).
  - We are currently enforcing Jest test coverage across the codebase. You can find the minimum required % in [jest.config.js](../jest.config.js)
  - All Jest tests are run in Github CI and must pass before merging.

### E2E Tests (Cypress)

- Use [Cypress](https://www.cypress.io/) to write integration & end-to-end tests that can be run in a real browser. This allows testing certain browser behaviors that are not reproducible in jsdom.
  - All Cypress tests are run in Github CI and must pass before merging. You can test Cypress on your local machine, and by default it will test whatever is running at `http://localhost:3000` (whether it’s the dev server or production server).
  - Cypress has its own `package.json` file with its own set of dependencies. These must be installed before running any Cypress commands:
    - `yarn cypress:install` (this only needs to be run if Cypress dependencies change)
  - To test against the production site on your local machine, start the e2e docker compose stack:
    - `docker-compose -f docker-compose.e2e.yml up -d`
    - `yarn cypress:dev` (start the Cypress UI runner against the application)
  - You can also run Cypress against the dev stack. Just note that the dev server does _not_ match the same behavior as when it is running in production, so Cypress tests should always also be verified against what is going to be deployed to production.
    - `docker compose up -d` (start the NextJS dev server at localhost:3000)
    - `yarn cypress:dev` (start the Cypress UI runner against the application)

## Apollo Server Explorer

Apollo server comes with a built in tool for executing graphql queries against your local server. It's disabled by default, but you can easily enable it. To do so switch the `ApolloServerPluginLandingPageDisabled` in `src/pages/api/graphql.tsx` to the below with `ApolloServerPluginLandingPageLocalDefault` instead. Note you will need to enable embedding to allow it to connect properly to your server. Details about the options are [documented here](https://www.apollographql.com/docs/apollo-server/api/plugin/landing-pages)

```diff
diff --git a/src/pages/api/graphql.tsx b/src/pages/api/graphql.tsx
index 5fd1b8d..1979e22 100644
--- a/src/pages/api/graphql.tsx
+++ b/src/pages/api/graphql.tsx
@@ -6,7 +6,11 @@ import {
   ApolloError,
   gql,
 } from 'apollo-server-micro'
-import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
+import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
 import type { PageConfig } from 'next'

 import { typeDefs } from '../../schema'
@@ -64,7 +68,12 @@ const clientConnection = async () => {
 export const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
-  plugins: [ApolloServerPluginLandingPageDisabled()],
+  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
   context: async ({ req, res }) => {
```

## Wiremock

We use wiremock to avoid making 3rd party API calls during e2e testing. For example we use it to mock out the expected weather api calls that our end to end tests will make. Below is a table of the valid zip codes in the mock data long with the relevant data they will return. Once the service is running you can see all the mappings via the admin api: http://localhost:8181/__admin/. Note only the following zipcodes will work in e2e tests with this setup.

| city               | zipcode  | points url                         | gridpoint url                          | temp |
| :----------------- | :------- | :--------------------------------- | :------------------------------------- | :--- |
| Beverely Hills, CA | 90210    | /points/34.0901,-118.4065          | /gridpoints/LOX/149,48/forecast/hourly | 105  |
| Tempe, AZ          | 85202    | /points/33.3851,-111.8724          | /gridpoints/PSR/166,54/forecast/hourly | 29   |
| Chicago, IL        | 60601    | /points/41.8858,-87.6181           | /gridpoints/LOT/76,73/forecast/hourly  | 68   |
| Atlanta, GA        | 30310    | /points/33.7278,-84.42319999999998 | /gridpoints/FFC/49,86/forecast/hourly  | 83   |
| Guadalupe, AZ      | 85001    | /points/33.4484,-112.074           | /gridpoints/PSR/159,58/forecast/hourly | 99   |

Mappings are defined in [the mappings folder](../e2e/mappings). For more details see the [wiremock documentation](https://wiremock.org/docs/)

## Feature Flagging
- [Using and testing feature flags in the portal environment](development/feature-flags.md)


## Releasing

[Guide to releasing updates to the portal](how-to/releasing.md)
