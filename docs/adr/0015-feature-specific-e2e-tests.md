# Feature-specific e2e tests

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps
- Date: 2022-12-01

## Context and Problem Statement

End-to-end testing is used to test that an application behaves as expected from the perspective of the user. The current state of our e2e tests only partially meets that criteria, and is currently a mix of both feature-specific tests and tests that could be described as page-specific. Page-specific meaning, there is a test file for each page that is in the portal client, and some pages within the CMS dashboard. A lot of these page-specific assertions are already covered with our unit tests, so there exists a fair amount of redundancy. We also have a need for testing some features that require interaction with both the CMS and the portal client, so placing a test of that nature in a CMS folder or a portal client folder just makes things more confusing. There is also a lot of unnecessary complexity in some of these test files that chain together tests, causing test results to largely depend on the results of a prior test.

## Decision Drivers

- It's often difficult to know exactly where a new test should go
- A lot of existing tests rely on past actions/results from a test that comes before, which leads to more flakeyness and unnecessary complexity
- Having isolated, feature-specific tests will make it easier to use parallel test execution in Playwright, greatly reducing the execution time of tests

## Considered Options

- Do nothing, keep tests as they are, segmented tests that are specific to both the CMS and portal client
- Make tests isolated and feature-specific

## Decision Outcome

Chosen option: "Make tests isolated and feature-specific", because this will not only reduce the execution time of our tests, it will also reduce complexity, making it easier and faster to create new tests.

### Positive Consequences

- Less complexity around creating new tests
- Less mental overhead maintaining tests
- Further reduce test flakeyness by having more isolated tests
- Reduce test execution time

### Negative Consequences

- A lot of upfront work to break apart current test files

## Pros and Cons of the Options

### Do nothing, keep tests as they are, segmented tests that are specific to both the CMS and portal client

- Good, because we won't have to do break apart large test files
- Bad, because we will continue to have flakey, and overly complex tests
- Bad, because test execution time in CI likely continue to increase
- Bad, because there will continue to be confusion around where to place a new test

### Make tests isolated and feature-specific

- Good, because it makes it easier to create new tests
- Good, because isolated tests execute faster
- Good, because smaller test files leads to less comlexity
- Good, because smaller tests are easier to maintain
- Bad, because a lot of upfront work is needed to break apart and refactor current test files

<!-- markdownlint-disable-file MD013 -->
