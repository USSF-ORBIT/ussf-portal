# Environment variables

- [Environment variables](#environment-variables)
  - [Current Variables](#current-variables)
    - [Keystone Variables](#keystone-variables)
    - [Happo Variables](#happo-variables)
    - [Postgres Variables](#postgres-variables)
  - [Adding new environment variables](#adding-new-environment-variables)


## Current Variables

**These env variables are already set in `.envrc` and only need to be added to your local file if you want to override the defaults:**

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

### Keystone Variables

**These variables for Keystone are only needed for local development:**

- `PORT` to `3001` if you are running CMS alongside Portal, as Portal will default to using port `3000` and come into conflict with CMS

### Happo Variables

**Set these variables for Happo in a `.envrc.local` file (only needed for local development when using the `yarn happo` command):**

- `HAPPO_API_KEY` - specific happo account API key, stored in 1Password vault
- `HAPPO_API_SECRET` - specific happo account API secret, stored in 1Password vault

### Postgres Variables

**Environment variables for Postgres are set in the `docker-compose.services.yml` file which runs from the `ussf-portal-client` directory.**

- `POSTGRES_USER: keystone`
- `POSTGRES_PASSWORD: keystonecms`
- `POSTGRES_DB: keystone`

If running on standard port 5432, this makes the connection url one of the following:

- `postgres://keystone:keystonecms@host.docker.internal:6666/keystone?connect_timeout=10` (connecting from one docker container to another)
- `postgres://keystone:keystonecms@0.0.0.0:5432/keystone?connect_timeout=10` (connecting from host machine)

> [!WARNING]
> Caveat: If you're also running Postgres on your local machine, you may run into some port conflicts with the Postgres Docker container. This may result in the following errors when running `yarn dev`:
> 
> ```
> Error: P3000: Failed to create database: 
> Prisma could not connect to a default database (`postgres` or `template1`), 
> it cannot create the specified database.
> ```
>  OR when running e2e tests: 
> ```
> error: role "keystone" does not exist
> ```
> Both errors are the result of the same issue, which is that the app is trying to connect to a local instance of Postgres.
> In the docker-compose file, you can map `5432` to an unused port to resolve. Or stop Postgres on your local machine.


## Adding new environment variables

If you need to add a new environment variable used in the application, make sure to add it in the following places:
 - `.envrc` - Use this to document what the variable is, and set a default value for local development
- `environment-variables.md` (this file) - Add to the list above & document what the variable is
- `startup/index.js` - Add to the `requireVars` array in this file in order to require this variable is set on startup of the app.




