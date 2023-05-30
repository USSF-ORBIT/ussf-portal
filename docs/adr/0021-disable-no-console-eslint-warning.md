# Disable eslint no-console warning

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps @minhlai
- Date: 2023-05-24

## Context and Problem Statement

When developing JavaScript that will be executed in the browser, it is considered a best practice to avoid using console log methods because console messages are typically for debugging purposes only and should not be shipped to the client. However, the console is used to output information to the server logs when developing for Node.js, so this rule may not be appropriate in all cases.

See also [eslint no-console documentation](https://eslint.org/docs/latest/rules/no-console#when-not-to-use-it)

## Decision Drivers

- Reduction of alert noise
  - See also [ADR 19](docs/adr/0019-stricter-lint-checks-and-how-to-add-exceptions.md)
- Best practices for JavaScript development

## Considered Options

- Make `no-console` warning an error and mark allowed uses.
- Disable `no-console`

## Decision Outcome

Chosen option: "Disable `no-console`"

### Consequences of Decision Outcome

- Good, because it allows for greater flexibility in development
- Good, because we don't have extra warnings
- Bad, because it may result in console messages being shipped to the client in JavaScript designed for the browser, which could be a security risk or degrade the user experience

## Validation

Compliance with this decision will be validated through code reviews

## Pros and Cons of the Options

### Make `no-console` warning an error and mark allowed uses

- Good, because it adheres to best practices for JavaScript development
- Bad, because it doesn't destinguish between client side console logs vs server side console logs

### Disable `no-console`

- Good, because it allows for greater flexibility in development
- Good, because we don't have extra warnings
- Bad, because it may result in console messages being shipped to the client in JavaScript designed for the browser, which could be a security risk or degrade the user experience

## Links

* [eslint no-console documentation](https://eslint.org/docs/latest/rules/no-console#when-not-to-use-it)
* [ADR 19](docs/adr/0019-stricter-lint-checks-and-how-to-add-exceptions.md)
