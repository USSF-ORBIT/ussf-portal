# USSF Portal CMS

## Local Development

### System requirements

- [direnv](https://direnv.net/docs/hook.html)
- [Docker](https://www.docker.com/products/docker-desktop)

To run Keystone outside, you will also need a [Postgres](https://www.postgresql.org/download/) instance running. You can run one on your machine, or run `yarn services:up` which starts all required services in Docker, including Postgres.

### Environment variables

The following are set in `.envrc` and only need to be added to your local `.envrc.local` file if you want to override the defaults

These variables for Keystone are only needed for local development:

- `PORT` to `3001` if you are running CMS alongside Portal, as Portal will default to using port `3000` and come into conflict with CMS

These env variables are already set:

- `SESSION_SECRET` - must be a string at least 32 chars, must be the same value set in the Portal application
- `SESSION_DOMAIN` - the domain used for both the Portal app & CMS apps, must be the same value set in the Portal application
- `DATABASE_URL` - URL to the running Postgres instance used for the CMS database
- `PORTAL_URL` - URL to the running Portal application
- `REDIS_URL` - URL to the running Redis instance, used by both CMS & Portal applications for storing sessions

#### Adding new environment variables

> If you need to add a new environment variable used in the application, make sure to add it in the following places:
>
> - `.envrc` - Use this to document what the variable is, and set a default value for local development
> - `README.md` (this file) - Add to the list above & document what the variable is
> - `startup/index.js` - Add to the `requireVars` array in this file in order to require this variable is set on startup of the app.

Environment variables for Postgres are set in the `docker-compose.services.yml` file ran from `ussf-portal-client` directory.

- `POSTGRES_USER: keystone`
- `POSTGRES_PASSWORD: keystonecms`
- `POSTGRES_DB: keystone`

If running on standard port 5432, this makes the connection url one of the following:

- `postgres://keystone:keystonecms@host.docker.internal:6666/keystone?connect_timeout=10` (connecting from one docker container to another)
- `postgres://keystone:keystonecms@0.0.0.0:5432/keystone?connect_timeout=10` (connecting from host machine)

Caveat: If you're also running Postgres on your local machine, you may run into some port conflicts with the Postgres Docker container. This may result in errors that say:

```
Error: P3000: Failed to create database: Prisma could not connect to a default database (`postgres` or `template1`), it cannot create the specified database.
```
when running `yarn dev` OR when running e2e tests, 
```
error: role "keystone" does not exist
```
Both errors are the result of the same issue, which is that the app is trying to connect to a local instance of Postgres.
In the docker-compose file, you can map `5432` to an unused port to resolve. Or stop Postgres on your local machine.

### Keystone App

- Run required services (`yarn services:up`)
- Run Keystone in dev mode (`yarn dev`)
- Run portal client (`cd ../ussf-portal-client && yarn dev`)

_or_

- Build Keystone Docker image:
  - `docker build -t keystone .`
- Run Docker image:
  - `docker run -p 3000:3000 --env SESSION_SECRET=$SESSION_SECRET --env DATABASE_URL=$DATABASE_URL keystone`

### Yarn Scripts

- `yarn services:up`: Starts all required services in Docker
  - Stop containers with `yarn services:down`
- `yarn dev`: Starts Keystone in development mode and watches for changed files
- `yarn test`: Run Jest unit tests.
  - Run in watch mode with `yarn test:watch`
