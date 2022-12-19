# Team / Project Documentation

## Project Repos

- [USSF Portal Client](https://github.com/USSF-ORBIT/ussf-portal-client)
- [USSF Portal CMS](https://github.com/USSF-ORBIT/ussf-portal-cms)
- [USSF Analytics](https://github.com/USSF-ORBIT/analytics)

## How-tos

- [How To Update Github Actions](./how-to/updating-github-actions.md)
- [How to Release](./how-to/releasing.md)
- [How to manage JS dependencies](./how-to/dependencies.md)
- [How to run and/or update the e2e tests](./how-to/run-or-update-e2e-tests.md)

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
12. [Use Playwright to end-to-end test the Client](./adr/0012-playwrigt-e2e-client.md)
13. [Use Happo.io for visual regression testing](./adr/0013-happo-for-visual-regression-testing.md)
14. [Use Distroless Images for Running our Application](./adr/0014-distroless-docker-containers.md)
15. [Feature-specific e2e tests](./adr/0015-feature-specific-e2e-tests.md)
