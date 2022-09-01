# Use Playwright to end-to-end test the Client

* Status: Proposed
- Deciders: @gidjin @abbyoung @jcbcapps
* Date: 2022-08-29

## Context and Problem Statement

[ADR 00010 Use Playwright to end-to-end test the CMS](./0010-playwright-e2e-cms.md) introduced playwright as a possible new framework for end-to-end (e2e) testing. At the time the use of playwright was uncertain but solved the issue blocking the tests using Cypress. 

Now that we've lived with both for a while we would like to consolidate to one testing framework.

## Decision Drivers

* Two frameworks take more maintenance than one
* The team has a general preference for playwright tests over cypress tests
* The team wants to reduce flakey tests and solving that in two frameworks is more difficult

## Considered Options

* Do nothing, standard option keep both frameworks
* Switch back to Cypress based tests only
* Switch to Playwright based tests only

## Decision Outcome

Chosen option: "Switch to Playwright based tests only", because having one framework will be less maintenance and reduce mental overhead for the team.

### Positive Consequences

* Only one e2e framework needs to be maintained with updates
* Only one e2e framework needs to be worked with by the team
* We can reduce our configuration that supports both frameworks reducing build time overall
* Flakey cypress tests may no longer be flakey once converted

### Negative Consequences

* We will need to re-write cypress tests in playwright
* Unclear how helpful the playwright generation tool will be
* Playwright tests can also be flakey.

## Pros and Cons of the Options

### Do nothing, standard option keep both frameworks

* Good, because least amount of up front work
- Bad, because we have flakey tests in both suites
- Bad, because we have to take time to update both suites
- Bad, because both suites work differently

### Switch back to Cypress based tests only

* Good, because only need to support and understand one framework
* Good, because all tests would use same suite
- Bad, because we will need to re-write tests from playwright to cypress
- Bad, because cypress has a domain limitations, making it difficult to test the CMS. See [ADR 0010](./0010-playwright-e2e-cms.md)

### Switch to Playwright based tests only

* Good, because only need to support and understand one framework
* Good, because all tests would use same suite
* Good, because current team likes working with playwright better
- Bad, because we will need to re-write tests from cypress to playwright

## Links

* [ADR 0010](./0010-playwright-e2e-cms.md)