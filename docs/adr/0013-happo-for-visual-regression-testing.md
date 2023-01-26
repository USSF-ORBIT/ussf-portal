# Use Happo.io for visual regression testing

* Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps
* Date: 2022-09-09

## Context and Problem Statement

Visual regression testing is a type of automated testing that is meant to catch unintended visual side effects in rendered UI. This is an area of risk due to the global nature of CSS -- when changing CSS code to modify one element, there is always a possibility of inadvertent changes to other elements without knowing anything happened until it is discovered by happenstance after the fact.

Visual regression testing occurs by first taking screenshots of selected portions of rendered UI to use as references, then comparing screenshots with code changes against those references, and finally alerting the team to differences between the images for review. Because any changes, whether they are intended or not, require explicit approval, building visual regression testing into our workflow can help ensure all UI changes have been reviewed by members of the design and product teams, as well as provide a visual of cross-browser implementations without needing manual QA.

## Decision Drivers

* We wanted visual regression especially as we started working on Dark Mode which would require a lot of visual change.
* We had already discussed a tool such as happo, and the team was familiar with happo.
* Due to time constraints and ease of using happo we did not look at other options, but might be worth considering down the road.

## Considered Options

* Do nothing
* Use Happo

## Decision Outcome

Chosen option: Use Happo
- [+] Tests run on Happo's hosted platform, so engineers and CircleCI don't need to spend time/resources running them
- [+] Visual tests can run against all of the browsers we support: Chrome, Firefox, IE11, Safari, iOS Safari, Edge (on all pricing plans, including free open source)
- [+] Happo provides a UI for users with access to view and approve or reject changes, and approving does not require committing changes
- [+] Happo has a plugin to use with Storybook components, but can also be used to screenshot the application itself (for example, as part of Cypress E2E tests)
- [-] Happo runs tests on its hosted platform, so it requires giving Happo access to our Github repo (which is currently public)
- [-] Happo costs money for non-open source projects (pricing tiers depend on usage see [Happo pricing page for details](https://happo.io/pricing))
- [-] Test reports for free open source projects are public to anyone who has the link

### Positive Consequences

* Automated tests that will flag visual differences in configured browsers
* Don't need to rely on humans to notice differences in font, color, placement

### Negative Consequences

* Due to comparing screenshots Happo can generate false positives
* Cost is per component x browsers tested x runs so can add up quickly

## Pros and Cons of the Options <!-- optional -->

### Do nothing

If we did nothing we would rely on someone to notice a visual regression, which is tedious and prone to missing something.

* Good, because it's cheaper from a budget perspective
* Bad, because missing a regression is likely more expensive in reputation, user frustration, and time to circle back and fix.

## Links

* [Happo docs](https://docs.happo.io/docs/getting-started)
* [Happo pricing](https://happo.io/pricing)
* [Happo is standard Truss practice](https://playbook.truss.dev/docs/web/frontend/testing#visual-regression-testing)
* [Happo ADR for MilMove](https://transcom.github.io/mymove-docs/docs/adrs/replace-loki-with-happo)

<!-- markdownlint-disable-file MD013 -->
