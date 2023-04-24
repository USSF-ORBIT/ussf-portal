# Stricter lint checks and how to add exceptions when needed

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps @minhlai
- Date: 2023-04-24

## Context and Problem Statement

We use various linting tools to do static analysis on our project. We are at a state where the warnings are increasing steadily and we would like to avoid letting that run its course as it will lead to the habit of ignoring the warnings from our tooling. In that effort we will change the most common warnings that are adding up from `warn` to `error`. This will mean we are required to avoid the trigger or in certain cases mark the line as allowed with a note explaining why.

NOTE: This ADR isn't noting specific lint warnings that should be turned to errors. This is because that is expected to change as the project continues, but the general principal can be applied. Check out the `.eslintrc` file in the project repo to see what rules are in effect.

## Decision Drivers

- Warnings that do not block the build become noise that can be ignored
- Encourage everyone to document why we have diverged from linting standard
- Avoid bugs that could be caught by static code analysis

## Considered Options

- Do nothing
- Mark common lint checks as error

## Decision Outcome

Chosen option: "Mark common lint checks as error", because we want to document when we deviate from lint policy and reduce noise in the development process that could hide critical issues. 

The process:

- Team identifies a warning that has added noise and should be changed per this ADR.
- Team updates the lint configuration and fixes any existing issues
  - Fixes should change code to avoid the warning, if possible
  - If avoiding the warning is not possible developers should disable the specific rule needed, per line, and include a quick comment as to why it was disabled.

Example:
```typescript
      } catch (e) {
        // Prisma error most likely
        // outputting the error message to the keystone logs
        // eslint-disable-next-line no-console
        console.error(e)
        throw e
      }
```

Example with 2 warnings on one line:
```typescript
  for (const property of loggingProperties) {
    // property is coming from loggingProperties which is a hard coded array
    // also following line is an approved setup of console logging
    // so ingoring the no-console check
    // eslint-disable-next-line security/detect-object-injection,no-console
    console[property] = getLoggingFunction(property)
  }
```

[See example](https://github.com/USSF-ORBIT/ussf-portal-cms/pull/320)

## Pros and Cons of the Options

### Do Nothing

Leave things as is

* Good, because it requires no work
* Bad, because lint warnings will likely increase
* Bad, because lint warnings might affect the ATO process
* Bad, because it encourages the habit of ignoring noise in the build process

### Mark common lint check as error

We should strive to reduce noise and lint warnings. In that effort the most common one should be changed to error so that developers will need to avoid them or add notes explaing why the change is unavoidable. Recommendation is to only disable the specific rule needed and to include a quick comment as to why.

* Good, because we'll know why a lint check was disabled
* Good, because the lint check output will be short and it will be easier to see new ones
* Bad, because we'll have to explain each lint rule excpetion

## Links

* [Example PR of making this change](https://github.com/USSF-ORBIT/ussf-portal-cms/pull/320)
