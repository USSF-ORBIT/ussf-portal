# How to review a pull request

This page documents the basic steps we take when creating and reviewing a pull request. The steps are broken down by role of the person in the particular PR.

## As the original developer, I have

- [ ] Met the acceptance criteria, or will meet them in subsequent PRs or stories
- [ ] Created new stories in Storybook if applicable
  - [ ] Checked that all Storybook accessibility checks are passing
- [ ] Created/modified automated unit tests in Jest
  - [ ] Including jest-axe checks when UI changes
- [ ] Created/modified automated [E2E tests](https://github.com/USSF-ORBIT/ussf-portal)
  - [ ] Including cypress-axe checks when UI changes
  - [ ] Checked that the E2E test build is not failing
- [ ] Use [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html) to check for basic a11y issues
- [ ] Requested a design review for user-facing changes
  - This is automaticly triggered when there are changes to the Storybook files
- For any new migrations/schema changes:
  - [ ] Followed guidelines for zero-downtime deploys

## As code reviewer(s), I have

- [ ] Pulled this branch locally and tested it
- [ ] Reviewed this code and left comments
- [ ] Checked that all code is adequately covered by tests
  - [ ] Checked that the E2E test build is not failing
- [ ] Made it clear which comments need to be addressed before this work is merged
  - For ideas on how to do this see [Conventional Comments](https://conventionalcomments.org)
- [ ] Considered marking this as accepted even if there are small changes needed

## As a designer reviewer, I have

- [ ] Checked in the design translated visually
- [ ] Checked behavior
- [ ] Checked different states (empty, one, some, error)
- [ ] Checked for landmarks, page heading structure, and links
- [ ] Tried to break the intended flow
- [ ] Use [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html) to check for basic a11y issues

## As a test user, I have

- Run through testing:
  - [ ] On commercial internet in MSEdge
  - [ ] On commercial internet in Firefox
  - [ ] On commercial internet in Chrome
  - [ ] On commercial internet in Safari
  - [ ] On a mobile device in Firefox
  - [ ] On a mobile device in Chrome
  - [ ] On a mobile device in Safari
- [ ] Added any anomalous behavior to this PR
