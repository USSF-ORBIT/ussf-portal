# Use WireMock to Mock Third Party APIs fro E2E Tests

* Status: accepted
* Deciders: @gidjin @abbyoung @jcbcapps @minhlai
* Date: 2023-09-29

[Initial PR that set this up]()

## Context and Problem Statement

We are using a third party [weather api](/docs/adr/0025-weather-api.md) to retreive weather information. The E2E tests currently make real calls to this API as part of their work. See the current Weather Widget Test in `e2e/playwright/feature/weather-widget.spec.ts`. This works for the most part but the API can sometimes return errors and need to be retried. During normal usage this isn't a big deal but during E2E tests this happens and blocks the build. Since we run E2E tests so often the occasional error becomes a frequent occurance.

Additionally, we expect to integrate more third party APIs that we do not have control over going forward as well and this need to mock them for E2E testing will need likely expand.

## Decision Drivers <!-- optional -->

* The weather test `e2e/playwright/feature/weather-widget.spec.ts` is flakey and disrupting PR process
* Our E2E tests run often and seems unkind to hit third party APIs every time we do
* Hitting a third party API in every E2E test could cause rate limiting by the third party

## Considered Options

* Do Nothing
* [Mock Service Worker](https://mswjs.io) (MSW)
* [WireMock](https://wiremock.org)
* [WireMock Cloud](https://www.wiremock.io/)

## Decision Outcome

Chosen option: "WireMock Cloud", because it supports the mocking we need for the third party API, and doesn't require us to run another service for testing. Also the setup was the least intensive of the options evaluated. This shouldn't affect ATO requirements since we only use it for local development or running E2E tests in our CI pipeline.

### Positive Consequences <!-- optional -->

* Tests can stop being flakey due to the thrid party API
* Developer time can be focused on real errors
* E2E tests are not dependent on the uptime of the third party API
* E2E tests are not dependent access to the thrid party API, if access is tightly controlled
* Testing error scenarios of a third party API can be setup easily via the web ui
* Third Party won't rate limit our account due to E2E test usage

### Negative Consequences <!-- optional -->

* Another SAAS service to manage
* Free account may not be enough for our needs

## Pros and Cons of the other Options <!-- optional -->

### Do Nothing

Keep things as they are.

* Good, because there is no work involved
* Bad, because tests will remain flakey causing delays in PR process
* Bad, because flakey tests reduce the trustworthiness of the build pipeline
* Bad, because developer time is consumed sorting out spurious test failures

### [Mock Service Worker](https://mswjs.io) (MSW)

Highly recommended mocking tool for APIs. Kent C. Dodds uses this in [Epic React course](https://epicreact.dev).

* Good, because tests can stop being flakey due to the third party API
* Good, because developer time can be focused on real errors
* Good, because E2E tests are not dependent on the uptime of the third party API
* Good, because E2E tests are not dependent access to the thrid party API, if access is tightly controlled
* Good, because third party won't rate limit our account due to E2E test usage
* Bad, because designed for use with APIs you are building
* Bad, because seemed to be coupled with unit test setup vs independent service running

### [WireMock](https://wiremock.org)

Java tool designed for mocking third party applications. There is a docker container that runs this but also seemed like more work to main tain than using the cloud service.

* Good, because tests can stop being flakey due to the third party API
* Good, because developer time can be focused on real errors
* Good, because E2E tests are not dependent on the uptime of the third party API
* Good, because E2E tests are not dependent access to the thrid party API, if access is tightly controlled
* Good, because third party won't rate limit our account due to E2E test usage
* Bad, because we need to run another container or java service

## Links <!-- optional -->

* [weather api ADR 25](/docs/adr/0025-weather-api.md)
* [Mock Service Worker](https://mswjs.io)
* [WireMock](https://wiremock.org)
* [WireMock Cloud](https://www.wiremock.io/)

<!-- markdownlint-disable-file MD013 -->
