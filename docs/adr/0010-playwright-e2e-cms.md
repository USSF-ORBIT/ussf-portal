# Use Playwright to end-to-end test the CMS

- Status: Accepted
- Deciders: @suzubara @abbyoung @esacteksab @jcbcapps
- Date: 2022-04-14

## Context and Problem Statement

At this time we have already decided to [use Keystone for our CMS platform](./0006-use-keystone-cms.md), and also [use the existing portal SAML implementation](./0009-platform-auth-architecture.md) to authenticate in Keystone. Both of these decisions have had implications to our testing strategy:

- We want to continue to maintain high automated test coverage for not just the Portal application, but also the CMS, especially as we build out roles and workflows for content admin users.
- Because most of our code will be configuring the Keystone implementation, the scope of unit tests will be somewhat limited, and we also want to avoid testing the Keystone platform itself. Therefore, it will be more impactful to rely more heavily on end-to-end tests instead.
- The Portal login flow for Keystone authentication requires navigating to both the Portal URL and the Keystone URL, which means writing end-to-end tests using our existing [Cypress](https://www.cypress.io/) framework is difficult or not possible, because Cypress [imposes a limitation to visiting multiple domains in a single test](https://docs.cypress.io/guides/guides/web-security#Same-superdomain-per-test). We initially tried to work around this, but it has been a challenge, adds unneeded verbosity to our tests, and has been an issue when trying to test redirects.

## Considered Options

- Continue to use Cypress to test the CMS
- Use Playwright to test the CMS

## Decision Outcome

Chosen option: Use Playwright to test the CMS.

[Playwright](https://playwright.dev/) is a newer E2E testing framework that has many of the same capabilities as Cypress, but uses different approaches that make it more lightweight to use, and doesn't have the same domain limitations.

Because the CMS is a newer codebase and only has one E2E test suite so far, it is relatively easy to switch over to Playwright as an experiment, and I have already confirmed that the login redirect tests that were [failing in Cypress](https://github.com/USSF-ORBIT/ussf-portal-cms/runs/5875795069) are [passing in Playwright](https://github.com/USSF-ORBIT/ussf-portal-cms/runs/6010675336).

However, Playwright is still a new tool for the whole team, so my recommendation for now is to just use it for the CMS, evaluate it, and keep our option open to switch the Portal tests over in the future if we decide to. Both Playwright and Cypress have their pros & cons, and we may decide to continue to use both for different kinds of tests. I don't think there is any reason to rush converting the Portal E2E tests to Playwright.

### Positive Consequences

- Good, because we are more easily able to test authentication & redirect flows on the CMS
- Good, because Playwright is a lighter lift than Cypress to get up and running
- Good, because Playwright uses `async/await` syntax and relatively easy to learn coming from ES6

### Negative Consequences

- Bad, because we have to learn a new tool with different paradigms
- Bad, because we are using two different E2E testing frameworks at the same time

## Pros and Cons of the Options

### Continue to use Cypress to test the CMS

- Good, because we are already using Cypress on both the portal and CMS, and already have the tooling set up to run it in CI.
- Good, because we are already familiar with how Cypress works and how to use it.
- Bad, because Cypress has the aforementioned domain limitations, which is making it difficult to test the CMS.

## Links & Resources

- [Another Truss E2E ADR](https://github.com/trussworks/next-graphql-fe/blob/main/docs/adrs/FE-007%20Frontend%20Integration%20and%20E2E%20Testing%20Tool%20is%20Playwright.md)
- [Playwright vs Cypress proof of concept](https://github.com/muratkeremozcan/playwright-vs-cypress)
- [Playwright vs Cypress](https://medium.com/sparebank1-digital/playwright-vs-cypress-1e127d9157bd)
- [Is Playwright better than Cypress?](https://medium.com/geekculture/is-playwright-better-than-cypress-playwright-vs-cypress-151bd65a224f)
- [Puppeteer, Selenium, Playwright, Cypress – how to choose?](https://www.testim.io/blog/puppeteer-selenium-playwright-cypress-how-to-choose/)
