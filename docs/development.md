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

### Pre-requisites

1. **Set up [direnv](https://direnv.net/docs/hook.html)**

   - We're using direnv to manage environment variables.
   - You'll have to type `direnv allow` in your shell to load environment variables when they change, and when navigating into a project directory.

1. **Install [Docker](https://www.docker.com/products/docker-desktop)**

   - We're using Docker for local development, and to build & run the application in production.
   - Since we are _not_ using Docker as a full development environment, you will still need to check your node version and install packages (in order to do things like run tests, linting, Storybook, etc. on your local machine).

1. **Check your node version: `node -v`**

   - Make sure you are using the version of node specified in `.node-version`.
   - We recommend using [nodenv](https://github.com/nodenv/nodenv) to install and manage node versions.

1. **Use [yarn v1](https://classic.yarnpkg.com/lang/en/) to manage JS packages**

   - [Install yarn](https://classic.yarnpkg.com/en/docs/install) if you do not already have it.
   - Type `yarn` or `yarn install` inside the project directory to install dependencies. You will need to do this once after cloning the project, and continuously if the dependencies in `package.json` change.

### Environment variables

Set these variables for Happo in a `.envrc.local` file (only needed for local development when using the `yarn happo` command):

- `HAPPO_API_KEY` - specific happo account API key, stored in 1Password valut
- `HAPPO_API_SECRET` - specific happo account API secret, stored in 1Password valut

These env variables are already set in `.envrc` and only need to be added to your local file if you want to override the defaults:

- `SESSION_SECRET` - must be a string at least 32 chars, must be the same value set in the CMS application
- `SESSION_DOMAIN` - the domain used for both the Portal app & CMS apps, must be the same value set in the CMS application
- `MONGO_URL` - URL to the running MongoDB instance used for the Portal database (only used in local dev)
- `MONGO_HOST, MONGO_USER, MONGO_PASSWORD` - Only used in deployed environments for constructing the DocDB connection string. Need to be defined in other environments to start the app, but will be overridden by `MONGO_URL`.
- `MONGODB_DB` - Name of the MongoDB database used for the Portal database
- `REDIS_URL` - URL to the running Redis instance, used by both CMS & Portal applications for storing sessions
- `SAML_SSO_CALLBACK_URL` - (_local dev only_) URL to the Portal app login callback endpoint
- `SAML_IDP_METADATA_URL` - URL to the SAML IdP metadata
- `SAML_ISSUER` - String identifying the Portal app SAML service provider
- `MATOMO_URL` - URL to Matomo instance (this is not required for the app to run)
- `MATOMO_SITE_ID` - ID of the Portal app in Matomo (this is not required for the app to run)
- `KEYSTONE_URL` - URL to Keystone instance

#### Adding new environment variables

> If you need to add a new environment variable used in the application, make sure to add it in the following places:
>
> - `.envrc` - Use this to document what the variable is, and set a default value for local development
> - `docs/development.md` (this file) - Add to the list above & document what the variable is
> - `startup/index.js` - Add to the `requireVars` array in this file in order to require this variable is set on startup of the app.

### Logging in

This application uses SAML for its authentication mechanism. SAML relies on the existance of an Identity Provider (IdP). When running the app locally, there are two IdP options:

**1. Test SAML IdP:** this is a service that is included in our docker compose development stack, and will work automatically when running `yarn services:up`. There are several test users of various types that you can log in as, and more can be added to the `users.php` file. These test users have been set up with attributes that mirror the data we should get back from the real-life IdP. All names/IDs/etc. are randomly generated fake data.

| username         | password             | name                | category          | groups          |
| :--------------- | :------------------- | :------------------ | :---------------- | :-------------- |
| `user1`          | `user1pass`          | Bernadette Campbell | uniformed service | n/a             |
| `user2`          | `user2pass`          | Ronald Boyd         | civil             | n/a             |
| `portaladmin`    | `portaladminpass`    | Lindsey Wilson      | employee          | superadmin      |
| `cmsadmin`       | `cmsadminpass`       | Floyd King          | contractor        | CMS admin       |
| `cmsuser`        | `cmsuserpass`        | John Henke          | civil             | CMS user        |
| `analyticsadmin` | `analyticsadminpass` | Margaret Stivers    | contractor        | analytics admin |
| `analyticsuser`  | `analyticsuserpass`  | Holly Okane         | employee          | analytics user  |
| `cmsauthor`      | `cmsauthorpass`      | Ethel Neal          | civil             | CMS user        |
| `cmsmanager`     | `cmsmanagerpass`     | Christina Haven     | civil             | CMS user        |

**2. Production SSO IdP:** if you want to log in to the actual IdP we will use in all deployed environments (dev, test, and production) you can also do that. You will only be able to log in as your actual user with your CAC (so you won’t be able to test different user types this way). You will need to do some additional configuration:

- Set the following environment variables locally (check in Space Force OnePassword for `Secrets for Setting Up C1 SAML Locally`):
  - `SAML_IDP_METADATA_URL`
  - `SAML_ISSUER`
  - `SAML_SSO_CALLBACK_URL=http://localhost:3000/api/auth/login`
- Copy the `DoD_Root_CA_3.crt` and save this file to `./certs/DoD_CAs.pem`
- Set this local environment variable also:
  - `NODE_EXTRA_CA_CERTS='./certs/DoD_CAs.pem'`
- Start other services (Redis & Mongo, etc.) in Docker:
  - `yarn services:up`
- Run the app locally, either in dev or production modes:
  - `yarn dev` OR
  - `yarn build && yarn start`

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
- `yarn test:watch`: Run Jest tests in watch mode
- `yarn services:removeall`: Will force remove all running and stopped containers

To start the app server as it will run in production:

- `yarn build`: Builds the NextJS production asset bundle
- `yarn start`: Starts the NextJS server in production mode

Other:

- `yarn format`: Autoformat all code using Prettier
- `yarn lint`: Runs the TypeScript compiler and ESLint and outputs issues
- `yarn test`: Run Jest tests once
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

To run the app in detached development mode (with hot reloading):

```
docker compose up -d

```

Once services are running, start the NextJS app with `yarn dev`.

### Local Development with Keystone CMS

You can also use Docker Compose to spin up all services plus the external Keystone CMS by running `yarn cms:up`. This will start all above services plus Keystone.

Read more about the Keystone app at the [ussf-portal-cms repo](https://github.com/USSF-ORBIT/ussf-portal-cms), and access the local instance at `localhost:3001`.

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

The portal application uses MongoDB (AWS DocDB in deployed environments) as a data store for _non-sensitive_ user data. If you need to make a change that requires a database migration, follow these steps:

- As much as possible, consider how to scope the migration to its own branch / PR so it can be deployed independently of application code changes, and reinforce backwards compatibility to minimize the risk of errors in production.
  - This may require making code changes so the application can handle both the existing & changed data model _before_ running migrations.
  - Resource: [The pedantic checklist for changing your data model in a web application](https://rtpg.co/2021/06/07/changes-checklist.html)
- On your migration branch, run the following command to create a new migration:
  - `yarn migrate:create <migration name here>`
  - Example: `yarn migrate:create add-type-to-collections`
  - This will generate a new migration file with a timestamp under the `./migrations` directory
  - Give your migration an explicit & descriptive name
- Create a corresponding test file for migration under `./test/migrations`
  - Example: `./test/migrations/add-type-to-collections.test.js`
- Write your migration `up` and `down` code, and corresponding tests
  - The `up, down` functions are passed into the `runMigration` utility function, which will handle connecting to MongoDB, pass the `db` context into the migration, and close the connection afterwards.
- Test your migration in Jest
  - We use the [jest-mongodb preset](https://github.com/shelfio/jest-mongodb) so unit tests will run against a shared in-memory MongoDB instance
- Test your migration in MongoDB
  - If you connect to your local MongoDB instance (for example, using [mongo-express](http://localhost:8888/)) you can verify the data changes as expected when you run & rollback migrations
  - To run new migrations: `yarn migrate` or `yarn migrate up <migration name>`
  - To rollback: `yarn migrate down` or `yarn migrate down <migration name>`
  - To view the status of all migrations: `yarn migrate list`
  - Resources: [Documentation for node-migrate](https://github.com/tj/node-migrate)
- Test your migration in the application
  - The migrate script is run automatically when the application server starts (in all environments: development, production, and in Docker) as part of the startup script.
  - Start up the application in these environments to make sure the migration runs successfully and does not cause an error.
  - This will also be tested in the Cypress CI workflow, which builds & starts the application in Docker.

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

## Launch Darkly

We are using the [FedRAMPed version of Launch Darkly](https://docs.launchdarkly.com/home/advanced/federal) for feature flags in the portal. If you need an invite to our group ask. There are 4 environments setup (localhost, dev, staging, and production) that correspond with our main environments. The feature flags are defined in our account and should exist at the project level so they can be configured per environment.

### Local setup

To see things with features turned on locally there should be no additional setup. The `localhost` environment client side id is already in `.envrc`. This is okay because it does not need to be kept secret. See [Lauch Darkly documentation for details](https://docs.launchdarkly.com/sdk/concepts/client-side-server-side?site=federal#client-side-id). Note localhost enviroment feature flags are shared with anyone using the same client side id, but the expectation is that pretty much all flags are on in this environment for local development and testing.

**Relavant quote from [docs](https://docs.launchdarkly.com/sdk/concepts/client-side-server-side?site=federal#client-side-id):**

> Unlike a mobile key, the client-side ID for an environment never changes. The client-side ID does not need to be kept a secret.

## Releasing

We are using a tool called [standard-version](https://github.com/conventional-changelog/standard-version) to facilitate version bumps and releases in order to maintain a clear history of this project. In order to tag a new release:

- Check out the `main` branch and make sure to pull down the latest changes
- Run `yarn release` -- this will add new entries to the changelog, and increase the version number based on the types of changes.
  - You can run `yarn release --dry-run` to preview the new version number and changelog.
  - You can also choose to release a specific version increment. See the [standard-version docs](https://github.com/conventional-changelog/standard-version#release-as-a-target-type-imperatively-npm-version-like) for more options.
- Commit these changes to a new branch called `release-x.y.z.` (where `x.y.z` is the new version number generated by the release script).
  - The commit message should follow the format: `chore(release): <VERSION NUMBER>`
  - Example: `chore(release): 1.2.0`
- Open a PR into `main` and merge once required checks have passed.
  - The PR body should include the new changelog entries.
- After merging the PR, [create a new release](https://github.com/USSF-ORBIT/ussf-portal-client/releases/new), tagging with the new version number and paste the new changelog entries into the description.
  - At this point, the tag is ready to deploy to production.
