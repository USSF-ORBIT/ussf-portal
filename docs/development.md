# Development
- [Development](#development)
  - [Environment Setup](#environment-setup)
    - [Pre-requisites](#pre-requisites)
    - [Environment variables](#environment-variables)
  - [`yarn` scripts](#yarn-scripts)
  - [Running the application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
    - [Running in Docker](#running-in-docker)
  - [Working on an issue](#working-on-an-issue)
  - [Database migrations](#database-migrations)
  - [PR linting](#pr-linting)
  - [Testing](#testing)
    - [User Testing](#user-testing)
    - [Automated Testing](#automated-testing)
    - [Additional Testing Tools](#additional-testing-tools)
  - [Feature Flagging](#feature-flagging)
  - [Releasing](#releasing)


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


## `yarn` scripts

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

- [Detailed Guide to Local development with Docker](development/local-dev-with-docker.md)

## Working on an issue

To begin working on an issue, make sure you've assigned yourself to the issue in [Shortcut](https://app.shortcut.com/orbit-truss) and marked it as "In Progress.".

Once you have an issue to work on, create a new branch off `main` using the naming convention:

`sc-{issue #}-{short description}`

For example: `sc-112-logo-component`

We have a pre-commit hook set up using Husky to run on staged files only. This will run [Prettier](https://prettier.io/), [TypeScript compilation](https://www.typescriptlang.org/) and [eslint](https://eslint.org/) and fail on errors. For an optimal developer experience, it's recommended that you configure your editor to run linting & formatting inline.

When your branch is ready, open a PR against `main`, fill out the description and request code reviews. The code must pass [linting and formatting checks](development/pr-commit-format.md) as well as [Jest tests](development/code-coverage-testing.md) in order to merge.

## Database migrations
- [MongoDB Migrations for the Portal Client](development/mongo-db-migrations.md)
- [Postgres Migrations for Keystone CMS](development/postgres-migrations.md)


## PR linting

In order to easily maintain a clear changelog, we require all PRs into the `main` branch to pass the [conventional commits spec](https://www.conventionalcommits.org/en/v1.0.0/#specification).

- [Formatting requirements for commits](development/pr-commit-format.md)


## Testing

### User Testing
  - [Logging in to the portal](./development/logging-in.md)

### Automated Testing
- [Unit and E2E tests](development/code-coverage-testing.md)

### Additional Testing Tools
- [Other tools for testing and debugging](development/additional-testing-tools.md)

## Feature Flagging
- [Using and testing feature flags in the portal environment](development/feature-flags.md)


## Releasing

- [Guide to releasing updates to the portal](how-to/releasing.md)
