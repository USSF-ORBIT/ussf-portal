# USSF Portal CMS

## Local Development

### System requirements

- [direnv](https://direnv.net/docs/hook.html)
- [Docker](https://www.docker.com/products/docker-desktop)

To run Keystone outside, you will also need a [Postgres](https://www.postgresql.org/download/) instance running. You can run one on your machine, or run `yarn services:up` which starts all required services in Docker, including Postgres.

### Environment variables
Most environment variables are already set in `.envrc` and only need to be added to your local file if you want to override the defaults. For more information, see [`environment-variables.md`](./development/environment-variables.md)

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
