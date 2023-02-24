# Disable Unsafe Regex Warning in the CMS Slug validation code

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps
- Date: 2023-02-03

Technical Story: [Article scheduler](https://app.shortcut.com/orbit-truss/story/544/article-scheduler)

## Context and Problem Statement

During the work on the [Article Scheduler](https://app.shortcut.com/orbit-truss/story/544/article-scheduler) story, we also disabled the `security/detect-unsafe-regex` warning in the `src/lists/Article.ts` of the USSF-ORBIT/ussf-portal-cms code.

## Decision Drivers

- I don't like seeing warnings
- We should review lint warnings for accuracy on a regular basis
- The `security/detect-unsafe-regex` flag points to places that might be exploited in a denial of service attack

## Considered Options

- Do nothing
- Fix the regex
- Disable the rule for the one line with explanation

## Decision Outcome

Chosen option: "Disable the rule for the one line with explanation", because the regex used, is the standard for testing slug format, our slugs are limited to 1000 characters max, we only use this slug during creation time, and in tests it took an extremly large string to cause a catastrophic backtrace.

### Positive Consequences

- Linter no longer warns of the issue
- We have considered the issue carefully to ensure it was not a risk
- Code was updated to ensure max length was checked before testing against the regex
- Test were done to see and no noticible slow down or significate use of time detected within the 1000 character max

### Negative Consequences

- It's not obvious why it's safe to disable this warning for this case
- Someone could swap the check for length without realizing the importance

This ADR is to help mitigate those risks by documenting the decision

## Pros and Cons of the Options

### Do nothing

Leave the warning present and ignore it.

- Good, because nothing to do
- Bad, because a warning is there and clutters the list of other warnings
- Bad, because a warning might be a real issue and ignoring it trains developers to ignore it.

### Fix the regex

Update it so the linter doesn't flag it.

- Good, because regex won't be vulnerable
- Bad, because despite trying several different solutions including a look ahead the linter still flagged it
  - Also unclear if the linter is can distinguish if this is fix or not. I did not investigate how it determined that.

### Disable the rule for the one line with explanation

Tell the linter to ignore the rule and add a comment as well as an ADR to document why.

- Good, because lint output is not cluttered with things we have decided to ignore
- Good, because it demonstrates we have considered the risk flagged and mitigated it
- Good, because documents how we mitigated it for our future selves and anyone joining the project
- Bad, because it takes time to write good documentation

## Links

- [Example large data set using javascript regex engine with no match](https://regex101.com/r/UwIBPv/1)
- [Example catastrophic backtrace using Php regex engine with no match and large data](https://regex101.com/r/JL7h0n/1)
- [Example dataset with 1000 characters](https://regex101.com/r/1b03uh/1)
- [Eslint Security Docs](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/regular-expression-dos-and-node.md)
- [Regex Catastrophic Backtrace in JavaScript](https://javascript.info/regexp-catastrophic-backtracking)
- [Detailed article about catastrophic backtrace](https://www.regular-expressions.info/catastrophic.html) **long**
- [PR that fixed this](https://github.com/USSF-ORBIT/ussf-portal-cms/pull/258)
  - See the [src/lists/Article.ts](https://github.com/USSF-ORBIT/ussf-portal-cms/pull/258/files#diff-649e60de90721db0f671d39718f28e9534c1d7328c8ee4d32363b1c6f5ea52dc) changes on lines 25-29 and 237-248.

<!-- markdownlint-disable-file MD013 -->
