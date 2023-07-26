# [Use GraphQL Cop in GitHub Actions to scan our GraphQL APIs]

- Status: Accepted <!-- optional -->
- Deciders: @gidjin @jcbcapps <!-- optional -->
- Date: 2023-06-12 <!-- optional -->

Technical Story: [Add GraphQL Cop to GitHub Actions](https://app.shortcut.com/orbit-truss/story/2123/add-graphql-cop-to-github-actions) <!-- optional -->

## Context and Problem Statement

We currently have two GraphQL APIs: one for the portal client, and another for the CMS. As of this writing, we are also standing up a third GraphQL API that will be used for ingesting personnel data into the portal client. We use linting and various other tools across our project to make sure that we are not committing bad code, but we currently do not have any checks in place for how we are using GraphQL. As we continue to grow our API ecosystem, we need a way to ensure that each API is properly configured so that we lessen the likelihood of them being abused by a potential attacker, or used improperly by an engineer on our team when adding a new query/mutation. We found a tool for this exact purpose called GraphQL Cop. It is a small Python utility used to run common security tests against GraphQL APIs, and is perfect for running in our GitHub Actions workflow.

## Decision Drivers <!-- optional -->

- We need an automated way to ensure that our GraphQL queries/mutations are properly structured, and that both Apollo Client and Apollo Server are properly configured.

## Considered Options

- Add GraphQL Cop to our GitHub actions to run when the schema changes
- Do nothing

## Decision Outcome

Add GraphQL Cop to our GitHub actions to run when the schema changes

### Positive Consequences <!-- optional -->

- Will keep us informed on security issues related to our GraphQL APIs
- Could prevent us from merging in a PR that would introduce a security vulnerability

### Negative Consequences <!-- optional -->

- We will have to spend time fixing issues that are found by GraphQL Cop
- We will have to add another check to our PR process

## Links <!-- optional -->

- [GraphQL Cop](https://github.com/dolevf/graphql-cop/tree/main)

<!-- markdownlint-disable-file MD013 -->
