# Team / Project Documentation

## Project Repos

- [USSF Portal Client](https://github.com/USSF-ORBIT/ussf-portal-client)
- [USSF Portal CMS](https://github.com/USSF-ORBIT/ussf-portal-cms)
- [USSF Analytics](https://github.com/USSF-ORBIT/analytics)
- [USSF Personnel API](https://github.com/USSF-ORBIT/ussf-personnel-api)
- [USSF Third Party API](https://github.com/USSF-ORBIT/ussf-portal/tree/main/test-jwt-service)

## Development setup

- [Development documentation](./development.md)

## How-tos

- [How to Update Github Actions](./how-to/updating-github-actions.md)
- [How to test a release](./how-to/release-testing.md)
- [How to Release](./how-to/releasing.md)
- [How to manage JS dependencies](./how-to/dependencies.md)
- [How to run and/or update the e2e tests](./how-to/run-or-update-e2e-tests.md)
- [How to Transfer a File To and From C1 using DoD SAFE](./how-to/transfer-file-to-from-c1-dod-safe.md)
- [How to Upload a File to C1](./how-to/upload-file-to-c1.md)
- [How to Use jq to Collect Stats on MongoDb User Data](./how-to/use-jq-to-collect-stats-on-mongo-db-data.md)
- [How to Use mongoexport on C1](./how-to/use-mongoexport-on-c1.md)
- [How to manually trigger a Happo comparison](./how-to/run-happo-comparison-manually.md)
- [How to review a pull request](./how-to/review-pull-request.md)
- [How to use dev AWS S3 locally](./how-to/use-s3-locally.md)
- [How to delete DocumentDB Snapshots](./how-to/how-to-del-docdb-snapshots.md)
- [How to grant CMS access](./how-to/Grant-CMS-acess.md)
- [How to use the SAML groups](./how-to/use-saml-groups.md)
- [How to Test JWT Auth with MobileConnect](./how-to/generate-jwt-token.md)
- [How to Test JWT Auth with Test JWT Service](./how-to/generate-jwt-test-service.md)

## Architectural Decision Records

When creating a new ADR, you can copy the [template](./adr/0000-template.md).

1. [Migrate the Space Force MVP and build alongside it in a single application](./adr/0001-initial-portal-implementation.md)
2. [Use NextJS with dynamic content powered by a headless CMS for the new USSF portal](./adr/0002-nextjs.md)
3. [Use GitHub flow for releasing the application code](./adr/0003-versioning-releasing.md)
4. [Use a NoSQL Database for Next.js App](./adr/0004-nosql-for-nexjs.md)
5. [Use Docker for running the application](./adr/0005-use-Docker-for-running-the-application.md)
6. [Use KeystoneJS as a CMS, starting with embedded mode](./adr/0006-use-keystone-cms.md)
7. [Use MongoDB + DocumentDB with Node.js Driver](./adr/0007-use-mongodb-nodejs-driver.md)
8. [Authentication Strategy & Architecture](./adr/0008-auth-architecture.md)
9. [Authentication & authorization strategy across platforms](./adr/0009-platform-auth-architecture.md)
10. [Use Playwright to end-to-end test the CMS](./adr/0010-playwright-e2e-cms.md)
11. [Separate Repo for end-to-end tests](./adr/0011-separate-repo-for-e2e-tests.md)
12. [Use Playwright to end-to-end test the Client](./adr/0012-playwright-e2e-client.md)
13. [Use Happo.io for visual regression testing](./adr/0013-happo-for-visual-regression-testing.md)
14. [Use Distroless Images for Running our Application](./adr/0014-distroless-docker-containers.md)
15. [Feature-specific e2e tests](./adr/0015-feature-specific-e2e-tests.md)
16. [Use info from CAC as id](./adr/0016-use-info-from-cac-as-id.md)
17. [Send AWS Cloudwatch Alarms to Slack](./adr/0017-use-cloudwatch-and-slack-for-alerting.md)
18. [Disable Unsafe Regex Warning in the CMS Slug validation code](./adr/0018-disable-unsafe-regex-in-cms-slug-code.md)
19. [Enable stricter lint checks and how to add exceptions](./adr/0019-stricter-lint-checks-and-how-to-add-exceptions.md)
20. [Use AWS Certificate Manager for DoD TLS Certificates](./adr/0020-use-aws-certificate-manager-for-dod-tls-certs.md)
21. [Disable eslint no-console warning](./adr/0021-disable-no-console-eslint-warning.md)
22. [Integrating personnel data into the portal](./adr/0022-integrating-personnel-data-into-the-portal.md)
23. [Use Github Actions Cache for Docker Builds in CI/CD](./adr/0023-github-actions-cache-for-docker-builds.md)
24. [Use GraphQL Cop in GitHub Actions to scan our GraphQL APIs](./adr/0024-graphql-cop.md)
25. [Use National Weather Service API for Weather Widget](./adr/0025-weather-api.md)
26. [Use WireMock to mock third party APIs for E2E tests](./adr/0026-use-wiremock-to-mock-third-party-apis-for-e2e-tests.md)
27. [Enable Playwright E2E retries](./adr/0027-enable-playwright-e2e-retries.md)
28. [Use LaunchDarkly Feature Flags](./adr/0028-use-LaunchDarkly-for-feature-flags.md)
29. [Use custom JWT service for testing third-party API](./adr/0029-test-jwt-service.md)
## Troubleshooting

[Some troubleshooting steps can be found here.](../TROUBLESHOOTING.md)
