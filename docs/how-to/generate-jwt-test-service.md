# How to Test JWT Auth with Test JWT Service

This guide is for using the Test JWT Service to generate a valid JWT for local testing of the Third-Party API. This service is also available to e2e tests.

For testing with MobileConnect, [see this guide](./generate-jwt-token.md).

Code for this service lives in the `ussf-portal` repo in the `test-jwt-service` directory.

## Step 0: Check environment variables and service config

* In `ussf-portal-client/.envrc.local`, set the following environment varible:
`NODE_TLS_REJECT_UNAUTHORIZED=0`

* In `ussf-portal-client/scripts`, create a file named `dod_ca_cert_bundle.sha256`. Look in the 1Password Vault under `DoD PKI CA Cert Bundle SHA256 Checksums`. Copy data for the latest version and paste into your new file.

* Look in the 1Password Vault under 'Test JWT Server Certs for Dev'. Copy and paste the (very long) private key into `ussf-portal/e2e/.envrc.local` as the following: `JWT_DEV_CERT="<value>"`

## Step 1: Set up Postman Collection 
For easier testing, we have a Postman collections in the 1Password Vault named `USSF Third-Party API local`. This is slightly different than the [collection used for testing with MobileConnect](./generate-jwt-token.md), so make sure you have both.

Copy the file from 1P and import the collection into Postman.

## Step 2: Run against local development

### Start the services and app
* In `ussf-portal-client`, run `yarn services:up`. Then run `yarn dev`.
* In `ussf-portal-cms`, run `yarn dev`.

### Get the userId
* Log in to the portal using the test user of your choice. In this example, we'll use FLOYD KING (cmsadmin/cmsadminpass)
* Go to `http://localhost:3000/settings` and copy the `userId`. For FLOYD, we've got `KING.FLOYD.376144527`.

### Make the requests
* In Postman, under `USSF Third-Party API local` collection in the sidebar, go to the request `Utility / Generate Token`. 
* Under `Params`, enter the key `userId` and the value you copied from the portal. Send.
* You should receive a response with a token, similar to:
`{"token":"eyJhbGciOiJ...etcetcetc"}`. Postman automatically sets this token in the header for all future requests in the collection.
* You can now send any of the requests under `Auth` and receive valid responses.

## Step 2: Run local e2e tests
* Stop the portal and cms applications. Go to `ussf-portal/e2e` and make sure you have no services up by running `yarn services:removeall`.
* In `ussf-portal/e2e`, run `yarn services:up`. This will run all services, including the portal and cms, in Docker.
* Once Docker is done building, you can now run `yarn e2e:test` and it can connect to the test service. This means you can write tests against the third-party API by generating a token first (see `e2e/playwright/feature/jwt-auth.spec` for example.)
* You can also use the app and service in the same way as in Step 1, making requests using Postman.