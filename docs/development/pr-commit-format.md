# Formatting Commits for Pull Requests

We follow the specification for commit formatting laid out by [Conventional Commits.](https://www.conventionalcommits.org/en/v1.0.0/#specification) 

Conventional Commits maintains handy [developer tools](https://www.conventionalcommits.org/en/about/#tooling-for-conventional-commits) for a variety of IDEs to streamline following this format.

- [Formatting Commits for Pull Requests](#formatting-commits-for-pull-requests)
  - [Overview](#overview)
    - [Types](#types)
    - [Scope](#scope)
    - [Body](#body)
    - [Footer](#footer)

## Overview

The format for PR commits is:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

The following `type`s are allowed:

- `build`: Changes that affect the build system or external dependencies (example scopes: webpack, npm)
- `chore`: Completing a task that has no effective code changes, such as updating the version and changelog for a release
- `ci`: Changes to our CI configuration files and scripts (example scopes: Circle, Github actions/workflows)
- `dev`: A code change that does not result in a user-facing feature (for example, a new component that is only visible in Storybook, or work that builds towards but does not complete a feature)
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: If the commit reverts a previous commit, it should begin with `revert:` , followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests

### Scope

`scope` is optional, and can be used to provide additional context, especially if changes only encompass a specific area of the code. Some examples include:

- `deps`: Updating a package listed in dependencies
- `deps-dev`: Updating a package listed in devDependencies
- `jest`: Changes to Jest tests
- `cypress`: Changes to Cypress tests
- `storybook`: Changes to Storybook or stories files only

### Body

The `body` will default to a list of included commits since PRs are all squashed when merging. You can choose to keep or remove this list, and also add additional context to the body if needed.

### Footer 

The `footer` should link the PR to any issues it closes (see: ["Linking a pull request to an issue"](https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue)).

Example:
```
Closes #123
```

The footer should also include `BREAKING CHANGE:` if the commit includes any breaking changes. This will make sure the major version is automatically bumped when this commit is released.