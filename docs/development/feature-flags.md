# Feature Flags

We are using [Launch Darkly](https://docs.launchdarkly.com/home) for feature flags in the portal. If you need an invite to our group ask. There are 4 environments setup (localhost, dev, staging, and production) that correspond with our main environments. The feature flags are defined in our account and should exist at the project level so they can be configured per environment.

### Local setup

To see things with features turned on locally there should be no additional setup. The `localhost` environment client side id is already in `.envrc`. This is okay because it does not need to be kept secret. See [Lauch Darkly documentation for details](https://docs.launchdarkly.com/sdk/concepts/client-side-server-side?site=federal#client-side-id). Note localhost environment feature flags are shared with anyone using the same client side id, but the expectation is that pretty much all flags are on in this environment for local development and testing.

**Relavant quote from [docs](https://docs.launchdarkly.com/sdk/concepts/client-side-server-side?site=federal#client-side-id):**

> Unlike a mobile key, the client-side ID for an environment never changes. The client-side ID does not need to be kept a secret.