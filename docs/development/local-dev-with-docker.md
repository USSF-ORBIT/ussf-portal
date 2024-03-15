# Local Development with Docker
  - [Services](#services)
    - [MongoDB](#mongodb)
    - [Mongo Express](#mongo-express)
    - [Test SAML Identity Provider](#test-saml-identity-provider)
    - [Redis](#redis)
    - [Postgres](#postgres)
    - [Matomo](#matomo)
    - [MariaDB](#mariadb)
    - [Test JWT Issuer](#test-jwt-issuer)
  - [Running the Portal](#running-the-portal)
    - [Local Development with Keystone CMS](#local-development-with-keystone-cms)
      - [Additional Keystone CMS commands](#additional-keystone-cms-commands)
    - [MongoDB in Docker](#mongodb-in-docker)
    - [Client in a docker container locally for debugging deployment issues](#client-in-a-docker-container-locally-for-debugging-deployment-issues)
    - [Known limitations](#known-limitations)


You can spin up your Docker environment using Docker Compose. By running `yarn services:up`, it will use `docker-compose.services.yml` to create and run the services required for development. This _does_ include Matomo (our analytics platform) for convienience though Portal does not require it to run.

## Services 

### MongoDB

- Uses official MongoDB image v4.0.0
- exposed on port `:27017`
- initalizes `dev` database
- persists volume `portal_data`

### Mongo Express

- In-browser GUI for MongoDB
- access on `localhost:8888`

### Test SAML Identity Provider

- Service for testing auth flow
- Access on `localhost:8080`
- Log in with test user credentials:
  - username: user1
  - password: user1pass
- Additional users can be configured in the `users.php` file

### Redis

- Uses official Redis v6.0.0
- Used to store session information

### Postgres

- Stores Keystone CMS data
- Persists volume `cms_data`

### Matomo

- Tracks Portal user events
- Uses Dockerfile from our [analytics repo](https://github.com/USSF-ORBIT/analytics) which should be checked out in  `../analytics/`.
- Depends on mariadb
- Persists volume `matomo_data`
- Access at `http://localhost:8081`
- Do not use `https` locally as the Matomo image is not setup for that locally
- Credentials are in the 1Password Vault 


### MariaDB
- Stores Matomo Data
- Persists volume `mariadb_data`

### Test JWT Issuer
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

## Running the Portal

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