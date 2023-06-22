# Disable eslint no-console warning

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps @minhlai
- Date: 2023-06-06

## Context and Problem Statement

When developing JavaScript that will be executed in the browser, it is considered a best practice to avoid using console log methods because console messages are typically for debugging purposes only and should not be shipped to the client. However, the console is used to output information to the server logs when developing for Node.js, so this rule may not be appropriate in all cases.

See also [eslint no-console documentation](https://eslint.org/docs/latest/rules/no-console#when-not-to-use-it)

## Decision Drivers

- Reduction of alert noise
  - See also [ADR 19](./0019-stricter-lint-checks-and-how-to-add-exceptions.md)
- Best practices for JavaScript development

## Considered Options

- Make `no-console` warning an error and mark allowed uses.
- Make `no-console` warning an error and provide for specific allowed uses.
- Disable `no-console`

## Decision Outcome

Chosen option: "Make `no-console` warning an error and provide for specific allowed uses."

### Consequences of Decision Outcome

- Good, because it allows for greater flexibility in development
- Good, because we don't have extra warnings
- Good, because we can allow the standard Node.js logging methods automatically
- Bad, because it may result in console those specifically allowed methods to end up in the browser console.

## Validation

Compliance with this decision will be validated through code reviews and automated eslint configuration that errors on uses of console except for the allowed examples.

## Pros and Cons of the Options

### Make `no-console` warning an error and provide for specific allowed uses.

- Good, because it adheres to best practices for JavaScript development
- Good, because it doesn't require devs to mark every valid use of conosle in backend code
- Good, because we don't have extra warnings
- Bad, because it doesn't destinguish between client side console logs vs server side console logs

### Make `no-console` warning an error and mark allowed uses

- Good, because it adheres to best practices for JavaScript development
- Good, because we don't have extra warnings
- Bad, because it requries developers to marke every use of console for server side logging
- Bad, because it doesn't destinguish between client side console logs vs server side console logs

### Disable `no-console`

- Good, because it allows for greater flexibility in development
- Good, because we don't have extra warnings
- Bad, because it may result in console messages being shipped to the client in JavaScript designed for the browser, which could be a security risk or degrade the user experience
- Bad, because it doesn't destinguish between client side console logs vs server side console logs

## Links

* [eslint no-console documentation](https://eslint.org/docs/latest/rules/no-console#when-not-to-use-it)
* [example of this configuration from another project](https://github.com/Enterprise-CMCS/managed-care-review/blob/b8ba0d6621cbf1d30a63b7995df41f2168df47c4/services/app-web/.eslintrc#L37-L38)
* [ADR 0019](./0019-stricter-lint-checks-and-how-to-add-exceptions.md)
