# Use custom JWT service for testing third-party API

* Status: accepted
* Deciders: @abbyoung, @jcbcapps, @gidjin
* Date: 02-02-2024

## Context and Problem Statement

In order to test our third-party API's auth-protected resolvers, we have to do a complicated set of API calls to receive a valid JWT from Guardian One Test Servers. It relies on MobileConnect Test, which is a separate service that is in active development. This makes token generation unpredictable and prone to blocking our work. It also cannot be automated since it relies on a browser and mobile app.

How can we create a valid JWT for local and e2e testing that doesn't rely on outside services and won't block our work?

## Decision Drivers

* We want to build and test API queries and mutations locally without relying on external services.
* We want to simplify the development process for engineers and the testing process for non-technical team members.
* We want to run e2e tests for the third-party API in GitHub Actions (GHA).


## Considered Options

* Use WireMock
* Do nothing
* Create a custom service

## Decision Outcome

Chosen option: Create a custom service, because it mimics the functionality in production as close as possible without relying on an external service.

### Positive Consequences <!-- optional -->

* Allows us to write e2e tests for our third-party API, and run those tests in GHA.
* We can test the auth as any user in our test database without having to create a new user that matches our real CAC credentials.
* We can develop locally without relying on an external service.
* We can generate a valid JWT in one click instead of multiple steps that cannot be automated.
* We have to add certs to our e2e tests, which brings our test environment in closer alignment with prod.


### Negative Consequences 

* It takes time to build and test the service.
* It adds another service (therefore a little more complexity) to our docker stack.


## Pros and Cons of the Options 

### Use WireMock

* Good, because we are already using WireMock for other API testing.
* Bad, because it wouldn't work as expected with our existing code.

### Do nothing

* Good, because no time is spent setting up a new solution.
* Bad, because local development on the API would be very difficult and slow.
* Bad, because it would lower our test coverage.
* Bad, because without e2e tests the quality of the third-party API would suffer.

### Create a custom service

* Good, because allows us to locally test prod-like functionality without relying on an external service
* Good, because allows us to write auth-protected resolvers faster
* Good, because allows us to write e2e tests for the third-party API
* Good, because does not require any substantial changes to our API server code.
* Good, because once it's built it requires little to no maintenance.
* Bad, because it takes time and resources to build.