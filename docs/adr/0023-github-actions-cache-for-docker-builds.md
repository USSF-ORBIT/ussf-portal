# Use Github Actions Cache for Docker Builds in CI/CD

* Status: accepted
* Deciders: @gidjin @abbyoung @jcbcapps @minhlai
* Date: 05/30/2023

Technical Story: [Experiment with Github Actions Cache for Docker builds](https://app.shortcut.com/orbit-truss/story/1949/experiment-with-github-actions-cache-for-docker-builds)

## Context and Problem Statement

We have two application Docker images that need to be built for our E2E tests in Github Actions. The build process can take a very long time so we use AWS ECR to save the Docker build caches and pull from ECR whenever an E2E test runs on GH. However, recently we have increased the volume of E2E test runs by parallelizing the test suite for each set of browser tests. This is exacerbated by the increase in pull requests made by RenovateBot too, in an effort to make Renovate PRs more easy to merge, which also increases the volume of E2E test runs. This increased volume means an increase in data transfer out volume from AWS ECR, which results in higher AWS billing cost.

## Decision Drivers

* In order to save AWS costs and maintain our Docker build efficiency, we experimented with replacing AWS ECR with Github Actions Cache and artifacts for saving and pulling the Docker build cache.

## Considered Options

* Continue using AWS ECR
* Switch to using GHA Cache

## Decision Outcome

Chosen option: "Switch to using GHA Cache", because it saves ODC cost while maintaining our ability to build Docker images efficiently.

### Positive Consequences

* We reduce AWS costs.
* We continue to have efficient Docker builds in GH.
* We keep our Github workflows boundaries tight by no longer pulling from AWS and keeping build artifacts within GH.
 

### Negative Consequences 

* We need to use a [Github Action](https://github.com/dawidd6/action-download-artifact) to download build artifacts from each of our application repos, as a repo's artifacts are not available to download from another artifact by default. This Action requires a GH Personal Access Token with `repo` scope.

## Pros and Cons of the Options

### Continue using AWS ECR

* Good, because it requires no work to continue in this way.
* Bad, because AWS ECR only allows `inline` Docker cache which takes the most space.
* Bad, because we have to maintain additional resources in AWS ECR for maintaining Docker build caches.
* Bad, because we do not need to have our GH workflows exit GH and pull from AWS idealy.
* Bad, because AWS costs will go up as we increase the velocity of our PRs which is antithetical to being efficient.

### Switch to using GHA Cache


* Good, because it is easier to see our cached build artifacts in Github than in AWS.
* Good, because it keeps all our build artifacts within Github boundary.
* Good, because our costs will remain the same no matter how often our E2E tests run or how many PRs are open.
* Good, because it is a cost savings measure.
* Good, because we can utilize Docker's `local` cache export/import feature which is more efficient than `inline` cache. It allows us to export each intermediate build stage's cache to a local directory instead of needing to attach the cache manifest to the Docker image.
* Bad, because we will require the workflow to use a Github Personal Access Token that has the ability to read `repo` scope in order to download artifacts from our application repos.

## Links

* [Docker Local cache](https://docs.docker.com/build/cache/backends/local/)
* [Github Cache action](https://github.com/actions/cache)
* [Download workflow artifact GitHub Action](https://github.com/dawidd6/action-download-artifact)

<!-- markdownlint-disable-file MD013 -->
