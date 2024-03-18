# Unit and Integration Testing

Code coverage is key to deploying safe and stable updates to the portal. As you write new code, ensure that the appropriate unit and E2E tests are added. 

[Additional tools](additional-testing-tools.md) are available to aid in writing and running tests.

- [Unit and Integration Testing](#unit-and-integration-testing)
  - [Unit Tests (Jest)](#unit-tests-jest)
  - [E2E Tests (Playwright)](#e2e-tests-playwright)


## Unit Tests (Jest)

- Use [Jest](https://jestjs.io/) to write unit tests for JavaScript code & React components that will be run in [jsdom](https://github.com/jsdom/jsdom).
  - We are currently enforcing Jest test coverage across the codebase. You can find the minimum required % in [jest.config.js](../jest.config.js)
  - All Jest tests are run in Github CI and must pass before merging.

## E2E Tests (Playwright)

- Use Playwright to write end-to-end tests. 
  - [How to run/update e2e tests](../how-to/run-or-update-e2e-tests.md)

