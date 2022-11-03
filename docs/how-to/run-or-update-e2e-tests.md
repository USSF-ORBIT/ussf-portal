# How To Run and/or Update the End-to-End (E2E) tests

## Run E2E tests locally

### 0. Pre-requisites

The e2e tests rely on the client and cms repos being present. It is assumed that they are checked out at the same level as this `ussf-portal` repo and have the default names `ussf-portal-client` and `ussf-portal-cms`.

### Change directory

You will need to be in the `e2e` directory

`cd e2e`

### Install cypress & playwright

You will need the dependencies installed so run the following.

```sh
yarn
yarn cypress:install
yarn e2e:install
```

### Shutdown any other docker containers

Since the normal services can conflict with the current setup of e2e tests you probably want to shut everything else down. The following command will remove all containers.

`yarn services:removeall`

### Start the services

You will need everything running before running any of the tests. This repo has a docker compose file that does just that. Since this command will build the client and cms docker images it can take a while.

`yarn services:up`

> NOTE: this will start everything in the forground which can be helpful for debugging, but you can run the following to start in the background if that's prefered.

`yarn services:up -d`

### Run E2E tests in github actions manually

Once the services are up, may take a while sometimes keystone database takes a bit to start up. 

Now you can run the playwright based tests

`yarn e2e:test`

And/Or the cypress based tests

`yarn cypress:dev`

## Standard workflow

The e2e tests for the portal client and cms live in this repository now. During the pull request stage for the workflows to pass in this repository or the others you will need to use the **same _branch name_** in all 3 repos.

Update the code as usual in client or cms repos. Then update or write the e2e tests once the PRs are in the review stage.

> NOTE the workflow for running the e2e tests is run during the cms and client repos, but at this time is not required to avoid having the flakey tests hold up every PR. It will be the responsibility of the PR author and reviewers to ensure that PRs are not breaking the e2e tests in an unexpected way. The expectation is that we will require this to pass again once the job is shorter and much less flakey.
