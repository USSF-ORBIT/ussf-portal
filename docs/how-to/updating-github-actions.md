# How To Update Github Actions

On this project, we use Github Actions. In the spirit of open source and community, there is value in standing on the shoulders of those who came before us. But not everyone has the purest intent. Github Actions can offer an entry point to secrets and passwords that exist in our environment. So we owe ourselves due diligence to review individual Github Actions to the best of our abilities to ensure an Action is safe to use in our build and delivery pipeline. This is done with a multi-prong approach.

1. Trust Github Actions created by Github. It's their product, their platform, their Actions. High trust here.
1. Trust Github Actions that are created by verified creators. Github did the hard part for us. There is a greater amount of trust with these Actions than community Actions.
1. As with any software language, best practices says to pin versions. We verify versions, not the Action itself. Renovate will manage these pins and version upgrades for us, but require us to administer the exceptions.

To administer the allowed exceptions, navigate to [org actions settings](https://github.com/organizations/USSF-ORBIT/settings/actions). If this returns a 404, please ensure you're logged in with an account that has the appropriate permissions. Should you not, please contact someone who does.

The convention for the naming of actions in this field is `$author/$action-name@$sha-sum`. There is a scenario in which you need to allow the current version as well as the future version that Renovate bot is trying to upgrade to. On a pull-request like [this](https://github.com/USSF-ORBIT/ussf-portal-client/pull/185/files), you can get the future version of the sha-sum from here. You should not have exceptions for numbered versions (e.g. `$author/$action-name@v2.3`). Upon merging the new version, you should remove the previous version from the org's action's settings.
