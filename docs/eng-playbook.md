# Engineering Playbook USSF ORBIT Portal Project

_Note_ This doc is not intended to be declarative, but rather it is intended to be informative. This in addition to [ADR's](../adrs/) should highlight conventions, patterns, tooling and decisions on this project. This doc is intended to be a living doc and in the spirit of Agile, it is subject to change.

## Local Development

### Editor

Most of us on the team today use [VSCode](https://code.visualstudio.com/) or [VSCodium](https://vscodium.com/). While it is not a requirement to use either, as we don't share configs, if
you're not married to an editor, we recommend you use one of these.

#### Tabs vs Spaces

???

#### Line Character Limit

???

#### Linter(s) and their configuration(s)

???

#### Style Guide

???

### Docker

Local development is done with Docker and Docker Compose. This allows us to install as few things as necessary on our local workstation. It also allows us to use the same artifact (Docker image) locally that we could eventually ship to production.

Docker images are based off of [Debian-Slim](https://hub.docker.com/_/node?tab=tags&page=1&name=14.19.1-slim).

We pin our image versions rather than `:latest`. For 3rd party applications (Mongo, PostgreSQL, Redis, etc.), we try and use the same version that's available on our hosting provider.

## Git

### Account Configuration

We work on public [Github](https://github.com/USSF-ORBIT/) with as much open-sourced as possible. We embrace open source and transparency. We do require that 2FA is enabled on your GitHub account. Whether you choose to use an existing personal GitHub account or if you set up a unique one for this project, that's entirely up to you.

### Signed Commits

We require and enforce [signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits). Like an editor, while not required, we have used [Krypton](https://krypt.co/) as it has the least amount of friction to get set up. You can also use a YubiKey or some other hardware token.

### Conventional Commits

We adopt and enforce with a GitHub Action [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). This allows us to generate changelogs with little effort when publishing a release. In addition to the above link, own own documentation that provides more light on the topic, exists [here](https://github.com/USSF-ORBIT/ussf-portal-client/blob/main/docs/development.md#pr-linting).

## CI/CD

### GitHub Actions

We've chosen to use GitHub Actions for our CI/CD run-time environment. Because our code is already hosted on GitHub, it made the most sense rather than adopting a different CI/CD tool. It has also become our preferred tool over CircleCI and Jenkins. Because of recent supply chain attacks, we owe ourselves due diligence to evaluate GitHub actions prior to introducing them into our environment. We filter Actions at the Org-level. We also owe ourselves that same due diligence when upgrading GitHub Actions. We trust GitHub native actions, we prefer GitHub Actions from verified authors and we pin to specific releases rather than `@latest`.

### Code Owners

### Required Checks

## IaC

### Terraform
