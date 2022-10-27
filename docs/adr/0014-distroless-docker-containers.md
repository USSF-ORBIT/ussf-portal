# Use Distroless Images for Running our Application

* Status: accepted
- Deciders: @esacteksab @minhlai @gidjin
* Date: 2022-10-25

## Context and Problem Statement

A container is a standard unit of software that packages up code and all its dependencies so the application runs quickly and reliably from one computing environment to another. A Docker container image is a lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, system tools, system libraries and settings. Though they are lightweight, there is often extraneous things in a Docker container image that are not required to run an application. These extraneous things can sometimes have vulnerabilities or false positive vulnerabilities, and increase the attack surface of our application.


"Distroless" images contain only your application and its runtime dependencies. They do not contain package managers, shells or any other programs you would expect to find in a standard Linux distribution. It attempts to have the least required for an application to run.

## Decision Drivers

* Restricting what's in your runtime container to precisely what's necessary for your app is a best practice.
* Improve the signal to noise of scanners (e.g. CVE). That means we can be more sure that a detected vulnerability is a true positive.
* Decreasing the attack surface of our application by removing unecessary binaries and libraries.

## Considered Options

* Do nothing
* Use Distroless Images

## Decision Outcome

Chosen option: Use Distroless
- [+] Portal Client application will deploy in a distroless container.
- [+] Keystone CMS application will deploy in a distroless container.
  - Keystone CMS will require a shell however in order to run database migrations. For this reason, a system shell is copied to the final Keystone CMS image.
- [+] Either E2E tests or a new test should be performed on the application while running distroless containers. If we continue with the latter, a different Dockerfile can be written for running E2E tests locally which do not use Distroless.

### Positive Consequences

* Resolves CVEs for operating system dependencies and extraneous packages that are not needed for our application.
* Should see fewer false positive CVEs and have a better rate of true positive CVEs after extraneous packages are not deployed.

### Negative Consequences

* Google's Distroless Images come in `AMD64` (or `x86-64`) and `ARM64` CPU Architectures. In Github Actions and AWS Elastic Container Services, we deploy `AMD64` or `x86-64`. However many of us have M1 Macbooks which are `ARM64`. Because there are libraries missing from Distroless, they must be copied from another image and these libraries can only run on a similar CPU architecture as the one in which they were compiled. This means in order to run Distroless locally, one would have to pull the `ARM64` version of an image to match the host CPU architecture on M1 Macbooks.
  * Keystone CMS requires some files to be built that are CPU Architecture specific. So far, Keystone binaries have been fickle and do not work when copied from one image to another under `ARM64` but do work under `x86-64`.
  * The good news is that we probably don't need to ever build distroless locally. Our Engineers mostly have the applications run locally on the host rather than in Docker Containers. 
* We are currently running E2E tests on GHA by building the Dockerfile up to the E2E stage. If we are to mitigate risk during deployments, we really need to either make this stage run a Distroless Image or add a new testing stage that runs on a Distroless Image.
  * If we do the former, we must provide a different Dockerfile for running E2E tests locally. This will allow E2E tests to run in distroless in GHA and in regular containers locally.

## Links

* [Distroless docs](https://github.com/GoogleContainerTools/distroless)
* [Google Container Registry Node Distroless Images](https://console.cloud.google.com/gcr/images/distroless/global/nodejs)

<!-- markdownlint-disable-file MD013 -->
