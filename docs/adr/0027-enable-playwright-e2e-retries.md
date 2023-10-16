# Enable Playwright E2E Retries

* Status: accepted
* Deciders: @gidjin @abbyoung @minhlai
* Date: 2023-10-16

## Context and Problem Statement

E2E tests run as part of our build process, but despite our efforts to keep them stable there are the occasional flakey tests. The team habit is to re-run the entire tests flow again to bypass the flakey tests. We've spent time to stabilize them but seems like they continue to have an occasional flake that cannot be resolved.

## Decision Drivers <!-- optional -->

* Flakey tests erode confidence in the test suite
* Playwright can automatically mark tests as flakey when it's configured to re-try failed ones
* Playwright can re-try individual failed tests saving resources
* Because we require branches to be up-to-date with main we are re-running the e2e tests frequently and hit flakey tests multiple times in one pr

## Considered Options

* Do nothing
* Enable playwright's retry feature
* Allow build to be marked passing if only one of three browsers fails

## Decision Outcome

Chosen option: "Enable playwright's retry feature", because it will help prevent the team from being used to failing tests, or having to wait for the whole test suite to re-run when we encouter a flakey test. 

### Positive Consequences <!-- optional -->

* Less time spent chasing flakey tests
* Build will be marked passing more consistently
* Playwright will still track flakey tests and the initial errors

### Negative Consequences <!-- optional -->

* We might not notice when tests become more flakey

## Pros and Cons of the Options <!-- optional -->

### Do nothing

* Good, because easiest
* Bad, because flakey tests frequently disrupt the build flow especially when trying to get PRs through

### Allow build to be marked passing if only one of three browsers fails

* Good, because it will be more likely for flakey tests to pass
* Bad, because it consumes a lot of resources and time to re-run the entire suite

## Links

* [Playwright Retry Docs](https://playwright.dev/docs/test-retries)

<!-- markdownlint-disable-file MD013 -->
