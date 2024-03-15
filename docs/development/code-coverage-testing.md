# Unit and Integration Testing

Code coverage is key to deploying safe and stable updates to the portal. As you write new code, ensure that the appropriate unit and E2E tests are added. 

[Additional tools](additional-testing-tools.md) are available to aid in writing and running tests.

  - [Unit Tests (Jest)](#unit-tests-jest)
  - [E2E Tests (Cypress)](#e2e-tests-cypress)


## Unit Tests (Jest)

- Use [Jest](https://jestjs.io/) to write unit tests for JavaScript code & React components that will be run in [jsdom](https://github.com/jsdom/jsdom).
  - We are currently enforcing Jest test coverage across the codebase. You can find the minimum required % in [jest.config.js](../jest.config.js)
  - All Jest tests are run in Github CI and must pass before merging.

## E2E Tests (Cypress)

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

