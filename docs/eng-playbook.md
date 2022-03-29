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

We use [Trivy](https://github.com/aquasecurity/trivy) in a GitHub Action to scan our container for vulnerabilities.

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

#### Remote State

State is stored in an S3 bucket. A lock is created in DynamoDB to ensure that two individuals aren't interacting with state at the same time.

#### Providers

We use AWS v3 Terraform Provider. v4 introduced breaking changes to S3 buckets so for the time being, we've chosen to not upgrade.

#### Modules

We should not use local modules. Given the opportunity, we'll favor TrussWorks [modules](https://github.com/trussworks/), then community modules from [Anton](https://github.com/terraform-aws-modules/), then [Cloud Posse](https://github.com/cloudposse/). Others are acceptable after a thorough analysis.

Care should be taken to not use modules that import modules that import modules (you get the point)...Should a change need to occur, the amount of effort and pull requests necessary to see that change land in the parent module is likely greater than if you were starting from scratch with something simpler.

#### TFSec

We use TFSec both in [VSCode](https://marketplace.visualstudio.com/items?itemName=tfsec.tfsec) as a plugin as well as a [GitHub Action](https://github.com/aquasecurity/tfsec-action) to do static analysis of our infrastructure as code codebase.

#### Variables are Free in Terraform

Don't be afraid to use variables in Terraform. They allow for reusability and they cost us nothing. Use sane defaults and good descriptions.

### Patterns

#### Encryption

Encryption should be enabled by default both for traffic in-flight as well as data at rest. In a test/dev/sandbox environment, using AWS's KMS keys is adequate. In a production environment, your managed KMS keys should be used instead.

#### Load Balancing

In a dev/test/sandbox environment, a shared [A|N|E]LB is acceptable. In a production environment, it may also be acceptable, but [A|N|E]LB's should not be shared across services. An Application load balancer serving a web application should listen on port 80 (HTTP) and 443 (HTTPS). Port 80 listener should be configured to do a direct to port 443 so that the website only ever serves traffic over HTTPS.

If the opportunity exists, Amazon's Certificate Manager ([ACM](https://aws.amazon.com/certificate-manager/)) should be the preferred method of terminating SSL on the load balancer. If ACM cannot be used, a preference for [Let's Encrypt](https://letsencrypt.org/) would be next in line. In the event you cannot use either, use [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html) to manage your certificate.

#### Environment Variables

The application should use Environment Variables for configuration and secrets. These values should be stored in AWS's [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html).
