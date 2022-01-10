# Authentication & authorization strategy across platforms

- Status: Approved
- Deciders: @suzubara @abbyoung @esacteksab @noahfirth
- Date: 2022-01-10

## Context and Problem Statement

At this point we have integrated SAML authentication into the [USSF Portal client application](https://github.com/USSF-ORBIT/ussf-portal-client), allowing users with a valid CAC to log in. There are currently no special roles or permissions in the Portal itself.

Some of our next efforts involve standing up separate services to help support the Portal: a content management system, and an analytics platform. Both of these services will require an authentication strategy that also verifies the user has permission to access them.

This ADR describes a proposed strategy to address both authentication and authorization for both the CMS and analytics platforms.

## Decision Drivers

- We need to continue to use SAML authentication in order to allow authorized users to log in using their CAC
- It places less burden on users if they don't have to log in with their CAC multiple times for each service
- The specific roles and permissions needed within each platform are still TBD, so the ability to modify these with little overhead is a priority
- Our chosen analytics platform has a paid option to use SAML authentication out of the box

## Decision Outcome Summary

- For CMS authentication, configure the CMS platform to access the same Redis instance as the portal application, where session data is stored, and use the Portal application login implementation to create a session.
- For analytics authentication, pay for the official SAML authentication plugin
- For each platform (CMS and analytics), maintain 2 roles within the SAML identity provider directory -- admin (which refers to the development team and superadmin users), and everyone else (which refers to any other user of the non-public side of the CMS or analytics platform). In addition, "everyone else" will be further segmented, based on their needs, into more specific roles by editing their roles within each platform.

---

## Considered Options (Authentication - CMS)

- Implement a new SAML service provider as part of the CMS platform (mirroring the same work we did on the portal application)
- **Configure the CMS platform to access the same Redis instance as the portal application, where session data is stored, and use the Portal application login implementation to create a session.**
- Use the default username/password authentication

## Decision Outcome

Configure the CMS platform to access the same Redis instance as the portal application, where session data is stored, and use the Portal application login implementation to create a session.

With this strategy, the CMS platform would be configured to look in the shared Redis store for an existing session. If there is no session, the user would be redirected to the Portal login page and prompted to log in. Once they log in, the session would be created and they would then be able to access the CMS.

### Positive Consequences

- We don't have to duplicate the SAML implementation we already set up on the Portal application
- We don't have to ask the SAML Identity Provider to create a new configuration to support another service provider
- Authorized users will be able to seamlessly access both the Portal application and the CMS without having to log in multiple times
- The CMS platform easily allows us to provide an existing session store to use for authentication
- This does not preclude us deciding to migrate to a separate SAML implementation or other authentication method in the future if we decide to

### Negative Consequences

- Requires the Portal application to be available in order to log into the CMS platform
- This assumes the session management policies for both services is identical (for example, timeout period)
- Allowing multiple services access to the same session store increases the potential for unauthorized users to access the CMS platform (this risk should be mitigated by the authorization strategy described below)

## Pros and cons of the other options

### Implement a new SAML service provider as part of the CMS platform (mirroring the same work we did on the portal application)

- Good, because it maintains clear separation between the CMS and Portal application, and does not require the Portal to be available in order to log in to the CMS
- Good, because it reduces the risk of unauthorized users being able to access the CMS platform
- Bad, because it would require work to more extensively customize the CMS authentication method
- Bad, because it would require authorized users to log in to both applications separately
- Bad, because it means duplicating an existing implementation with little to no variation
- Bad, because it requires us to configure another SAML Identity Provider config to support a separate service provider

### Use the default username/password authentication

- Good, because it requires no changes to the default CMS authentication method
- Good, because username/password is a common, straightforward authentication strategy
- Good, because we don't have to ask the SAML Identity Provider to create a new configuration to support another service provider
- Bad, because it would not allow users to log into the CMS with their CAC and username/password is not as secure of an authentication method
- Bad, because it would require us to manually create accounts for any users who need one
- Bad, because users’ identities would not be tied to their CAC credentials and could more easily be hijacked

---

## Considered Options (Authentication - analytics)

- **Pay for the official SAML authentication plugin**
- Use the default username/password authentication
- Implement our own SAML authentication plugin

## Decision Outcome

Pay for the official SAML authentication plugin

### Positive Consequences

- We're able to rely on an existing, officially supported SAML implementation with minimal work on our part
- We're able to easily continue using CAC authentication, which maintains a high security standard and is consistent with our other services
- It gets us the highest level of security with the least amount of work

### Negative Consequences

- We have to pay an ongoing, annual fee to use this plugin
- We have to ask our SAML IdP for a new service provider configuration

## Pros and cons of the other options

### Use the default username/password authentication

- Good, because it requires no changes to the default analytics authentication method
- Good, because username/password is a common, straightforward authentication strategy
- Good, because we don't have to ask the SAML Identity Provider to create a new configuration to support another service provider
- Bad, because it would not allow users to log into the analytics platform with their CAC and username/password is not as secure of an authentication method
- Bad, because it would require us to manually create accounts for any users who need one
- Bad, because users’ identities would not be tied to their CAC credentials and could more easily be hijacked

### Implement our own SAML authentication plugin

- Good, because it doesn't require paying an annual fee once the work has been completed
- Good, because it still lets users log in using their CAC
- Bad, because developing a custom SAML plugin for this feature would cost a significant number of engineering hours
- Bad, because our chosen analytics platform uses a significantly different tech stack (PHP, MySQL) from the rest of our system, and we don't necessarily have the expertise to do this work without support from external resources
- Bad, because it requires us to configure another SAML Identity Provider config to support a separate service provider

---

## Considered Options (Authorization - CMS & analytics)

_The below options assume that we have decided to use SAML / CAC authentication for both platforms. For any platform that might use username/password instead, authorization can be handled with the respective platform’s built-in role/permission management capabilities._

- Manage all roles within the SAML identity provider directory
- **Maintain 2 high-level roles for each application within the SAML identity provider directory (most privileged and least privileged) and further segment users into more specific roles managed within each platform**

## Decision Outcome

Maintain 2 high-level roles for each application within the SAML identity provider directory (most privileged and least privileged) and further segment users into more specific roles managed within each platform.

More specifically, with this approach we would create two broad user groups in the SAML IdP directory for each application, i.e.:

- `USSF_CMS_ADMIN, USSF_CMS_USERS`
- `USSF_ANALYTICS_ADMIN, USSF_ANALYTICS_USERS`

Users assigned to the `ADMIN` group would automatically get full user management permissions within that respective platform, and all other users who should have any kind of access will be assigned to the `USERS` group.

When a user assigned to the `USERS` group logs into the platform for the first time, they will automatically receive whatever role has least privilege.

For example, if the analytics platform has roles with permissions `admin, write, read`, a new user in the `USSF_ANALYTICS_USERS` group would automatically be assigned the `read` role. If they need elevated permissions (such as `write`), a user from the `USSF_ANALYTICS_ADMIN` group will need to manually grant them.

Futhermore, users who aren't in either `ADMIN` or `USERS` group (for example, those who have a valid CAC and may still be a regular user of the USSF Portal) can be denied access to these platforms outright.

### Positive Consequences

- Allows us to quickly manage and modify roles and granular permissions specific to each platform without having to access the IdP directory
- Maintains a degree of separation between the broad directory roles and the platform-specific roles, providing for more flexibility if we need to manage additional platforms or change to a different platform in the future.

### Negative Consequences

- Requires an admin user to manually assign the appropriate platform role to new users (this would need to happen anyways, but in the IdP directory instead)

## Pros and cons of the other options

### Manage all roles within the SAML identity provider directory

- Good, because all role management and assignment will exist in one place
- Bad, because platform-specific permissions and any authorization logic will still need to be implemented in the platform itself (i.e., mapping the platform permissions to the roles defined in the directory)
- Bad, because managing or assigning all roles will require accessing the SAML IdP directory
- Bad, because it more tightly couples the platforms themselves to our user groups (by requiring that we define more specific roles within the IdP directory)
