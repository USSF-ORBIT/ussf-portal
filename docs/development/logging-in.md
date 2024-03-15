# Logging in to the Portal
- [Logging in to the Portal](#logging-in-to-the-portal)
  - [Test SAML IdP](#test-saml-idp)
  - [Production SSO IdP](#production-sso-idp)

The portal application uses SAML for its authentication mechanism. SAML relies on the existance of an Identity Provider (IdP). When running the app locally, there are two IdP options:

## Test SAML IdP
This is a service that is included in our docker compose development stack, and will work automatically when running `yarn services:up`. There are several test users of various types that you can log in as, and more can be added to the `users.php` file. These test users have been set up with attributes that mirror the data we should get back from the real-life IdP. All names/IDs/etc. are randomly generated fake data.

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

## Production SSO IdP
If you want to log in to the actual IdP we will use in all deployed environments (dev, test, and production) you can also do that. You will only be able to log in as your actual user with your CAC (so you won’t be able to test different user types this way). You will need to do some additional configuration:

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