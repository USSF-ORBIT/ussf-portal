# Use LaunchDarky for Feature Flags

* Status: accepted
* Deciders: @gidjin @abbyoung @minhlai @jcbcapps @jbecker01
* Date: 2023-11-01

## Context and Problem Statement

We endeavor to have a reliable, and fast delivery pipeline. We prefer to release every two weeks but sometimes we do not feel 100% confident that a feature is ready for our users. Whether a feature has not been fully vetted in Test or there are small bugs discovered during the validation process, there are scenarios in which we want to push forward with a release especially if there are other improvements baked into the release. As well, if multiple code changes are being released together we would like a way to turn ON or OFF any of these changes at will and in conjuction with Matomo Analytics, see how our users adapt.

## Decision Drivers <!-- optional -->

* We want to be able to release features into Production safely with the knowledge that we have a safety to disable those features if they are discovered to not be ready for Production.
* We would like to be able to do the above without rolling back or cutting another release to disable the feature.
* We may want to do A/B testing in the future with a feature if we can establish user slices for testing features.

## Considered Options

* Do nothing
* Use LaunchDarkly Feature Flags
* Build our own feature flags

## Decision Outcome

Chosen option: "Use LaunchDarkly Feature Flags, because it will help us confidently release features in a way that allows us to experiment without frequently rolling back.

### Positive Consequences <!-- optional -->

* De-couples the act of delivering code from the act of enabling a new feature.
* Significantly shortens feedback cycle time for development and experimentation.
* Allows us to be flexible with developing a feature and merging it into Main for Demo-ing or experimentation, or stopping development for another priority, and hiding it from users.

### Negative Consequences <!-- optional -->

* Adopting a "Test in Production" mindset can be scary on the surface, especially if considered without many of the risk-reduction techniques detailed above.

## Pros and Cons of the Options <!-- optional -->

### Do nothing

* Good, because easiest
* Bad, because we lose out of the capabilities of Feature Flags that allow us to be nimble, flexible, and agile (3 words that mean the same thing)

### Build our own feature flags

* Good, because cheapest in terms of $$$
* Bad, because expensive in terms of Developer time
* Bad, because we will not necesarilly create a better product than LaunchDarkly

## Links

* [LaunchDarkly](https://launchdarkly.com/)

<!-- markdownlint-disable-file MD013 -->
