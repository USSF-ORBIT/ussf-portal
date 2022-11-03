# Releasing

This document describes our process for tagging a release when deploying a new version of our applications, and applies to both the [portal client](https://github.com/USSF-ORBIT/ussf-portal-client) & [CMS](https://github.com/USSF-ORBIT/ussf-portal-cms) applications.

## Why?

Even though our applications are not libraries used by other engineers, they are released to production on a regular basis, and have internal dependencies (i.e., between the portal client and the CMS). Keeping track of what changes correspond to a specific deploy helps us ensure backwards compatibility between applications, and makes it easier to identify when a specific change was made in the eventuality of issues. It also provides artifacts we can use for publishing release notes and tracking the progress of work completed on this project.

## When?

At the time of this writing, our release & deployment workflows are not completely automated. There are definitely some opportunities to further automate the process, described below. Right now we try to strike a balance between deploying frequently but not unnecessarily, which might mean there's a deploy every 1, 2, or even 3 weeks depending on the work in progress. Typically we should strive to deploy when one of the following is true:

- We have a set of dependency updates or completed refactor work that won't result in visible changes to users
- We have completed a feature or enhancement that is ready to be made available to users
- We have a partial feature that is ready to test or validate on production, but that is not yet discoverable or available to users
- We have a completed bug fix or other urgent change that should be released ASAP

It is useful to check on work that has been merged to the `main` branch, as well as current WIP or outstanding PRs on a regular cadence to determine when the next release should be tagged. This is primarily the responsibility of the engineering lead on the project. A new release should be tagged whenever we are ready to deploy an application to production, following the instructions below.

## How?

Both the portal client & CMS have been set up with the following tools & workflows to help facilitate releasing:

### Continuously test on AWS dev

- Whenever a branch is merged to `main`, the application is automatically deployed to our AWS dev environment.
- Ensure any changes, especially database migrations & any architectural or infrastructure changes, have been thoroughly tested on AWS dev.
- It's also a great idea to test the application that wasn't updated against the one that was. For example, if a new change is merged & deployed on the CMS, also login to the portal client on AWS dev and verify that nothing broke (and vice versa).

### Release on Github

1. To determine the next version of the application, you can run `yarn release --dry-run` which will output the anticipated new version & changelog without actually making any changes:

```
➜ yarn release --dry-run
yarn run v1.22.18
$ standard-version -t '' --dry-run
✔ bumping version in package.json from 4.2.0 to 4.2.1
✔ outputting changes to CHANGELOG.md

---
### [4.2.1](https://github.com/USSF-ORBIT/ussf-portal-client/compare/4.2.0...4.2.1) (2022-06-21)
---

✔ committing package.json and CHANGELOG.md
✨  Done in 0.56s.
```

2. Based on that output, create a new branch for the release changes:

```
git checkout -b release-4.2.1
```

3. Run `yarn release` again on that branch to update the version & changelog:

```
➜ yarn release
yarn run v1.22.18
$ standard-version -t ''
✔ bumping version in package.json from 4.2.0 to 4.2.1
✔ outputting changes to CHANGELOG.md
✔ committing package.json and CHANGELOG.md
$ lint-staged
[STARTED] Preparing lint-staged...
[SUCCESS] Preparing lint-staged...
[STARTED] Running tasks for staged files...
[STARTED] package.json — 2 files
[STARTED] *.{js,jsx,ts,tsx,json} — 1 file
[STARTED] *.{css,scss} — 0 files
[SKIPPED] *.{css,scss} — no files
[STARTED] prettier --write
[SUCCESS] prettier --write
[STARTED] eslint
[SUCCESS] eslint
[SUCCESS] *.{js,jsx,ts,tsx,json} — 1 file
[SUCCESS] package.json — 2 files
[SUCCESS] Running tasks for staged files...
[STARTED] Applying modifications from tasks...
[SUCCESS] Applying modifications from tasks...
[STARTED] Cleaning up temporary files...
[SUCCESS] Cleaning up temporary files...

✨  Done in 16.78s.
```

4. Push your new branch up and open a PR with the changelog in the description. Normally the only changed files should be `package.json` and `CHANGELOG.md`. Since there are no code changes, approval of this PR should just indicate sign off that we do, in fact, want to deploy the changeset to production.
   ![release PR](./release-pr.png)

5. Once the PR has been approved and merged, create a release on Github where the tag is the new version number, and the target is the newly merged release commit:
   ![new release](./new-release.png)
   ![releases](./releases.png)

### Deploy to staging & production

Someone with access to our staging/production infrastructure will need to deploy the image to first the staging environment, where any changes (especially database migrations) should be thoroughly tested, before proceeding to deploy to production. At this point the release is completed!

> It's important to communicate any specific needs to the infra team when deploying, such as if new environment variables need to be added or configured.

### Further automation

Even though our deploy automation is limited by our infrastructure, the release workflow itself can likely be further automated. Ideas include:

- A Github workflow that runs `yarn release` and opens the release PR in CI. This could be triggered by anyone on the project using a [`workflow_dispatch` event](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow).
- A Github workflow that tags the new release when a `release-x.y.z` branch has been merged to `main`.

### Versioning

We use the [standard-version](https://github.com/conventional-changelog/standard-version) tool to automatically generate a new version and changelog based on the standard commit messages on the `main` branch. It's a good idea to become familiar with the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard, and how certain commit types will trigger a patch, minor, or major version. Each application has valid commit types listed in their `package.json` under the `standard-version` config. A major version update will only happen if a commit indicates a breaking change, ie if the commit message includes `!` after the commit type (example: `feat!: ...`). However, you can also explicitly specify a version as part of the release command:

```
yarn release --release-as 5.0.0
yarn release --release-as minor
```

Since we should strive for backwards compatibility between the application & CMS as much as possible, major versions are most useful to indicate updates where certain database or infrastructure changes are required that would mean rolling back to a previous version might be more difficult than usual.

We can also make use of the `--prerelease` flag (and corresponding pre-release checkbox when creating a new release on Github) to indicate a release that includes changes that need to be tested on the production environment, before being made in a manner that will affect the end user experience. In this case, we follow the version format: `<new version>-beta.<build number>` where:

- `new version` is what the version will be once the feature has been released for real
- `beta` can be used to indicate the feature is being pre-released as beta - this could also be `alpha` if it's a very early test
- `build number` starts at `0` and is just a way to track pre-release iterations, for example if the first one fails or has issues and another pre-release is needed. This will just increase by one for each version.

![prerelease](./prerelease.png)

#### Example workflow:

- `5.0.0-beta.0` is released to test a feature that will eventually be user-facing, but for now is not discoverable (for example, it can only be accessed by explicitly navigating to `/search`, which only team members are aware of).
- A specific issue with the feature is discovered while the team tests on production, and needs to be released as `5.0.0-beta.1`.
- Once the feature has been fully tested and is ready to be released to users and made discoverable, for example by adding the new page to the existing UI, this change will be released as `5.0.0`.
