# Separate Repo for end-to-end tests

* Status: Accepted
* Deciders: @abbyoung @esacteksab @jcbcapps @gidjin
* Date: 2022-07-07

Technical Story: https://app.shortcut.com/orbit-truss/story/561/spike-investigate-moving-e2e-tests-to-independent-repo

## Context and Problem Statement

Since the portal client is becoming increasingly dependent on the CMS, and the CMS is also dependent on the portal client to login, both repos require the other application in order to run E2E tests. This is resulting in some duplication and redundant workflows being tested.

## Decision Drivers

* E2E tests exist in two repos
  * More feature work requires E2E tests in both existing repos
  * Desire to reduce duplicated test workflows
  * Reduce effort of coordinating versions of the client and cms when developing an E2E test
  * Remove decsion point of where a test goes
* E2E flakey tests have caused development pipeline troubles for the team

## Considered Options

* No change, E2E tests stay as they are in cms and client repos
* Move all E2E tests into separate repo from cms and client

## Decision Outcome

Chosen option: "Move all E2E tests into separate repo from cms and client", because .

### Positive Consequences

* One repo for E2E tests
* Developer workflow friction is reduced
* Reduced effort to convert tests to playwright if we choose to use it for client repo as well.

### Negative Consequences

* Additional work to setup a new repo
* Additional work to add E2E tests to the PR and ci build pipeline to trigger the tests
* Additional overhead on approving E2E tests in a spearate repo, so a feature my cross 3 PRs

## Links <!-- optional -->

* [ADR-0009 Use Playwright to end-to-end test the CMS](0009-platform-auth-architecture.md)