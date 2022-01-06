# Authentication & authorization strategy across platforms

- Status: Proposed
- Deciders: @suzubara @abbyoung @esacteksab @noahfirth
- Date: 2022-01-06

## Context and Problem Statement

At this point we have integrated SAML authentication into the [USSF Portal client application](https://github.com/USSF-ORBIT/ussf-portal-client), allowing users with a valid CAC to log in. There are currently no special roles or permissions in the Portal itself.

Some of our next efforts involve standing up separate services to help support the Portal: a content management system, and an analytics platform. Both of these services will require an authentication strategy that also verifies the user has permission to access them.

This ADR describes a proposed strategy to address both authentication and authorization for both the CMS and analytics platforms.

## Decision Drivers

- We need to continue to use SAML authentication in order to allow authorized users to log in using their CAC
- It places less burden on users if they don't have to log in with their CAC multiple times for each service
- The specific roles and permissions needed within each platform are still TBD, so the ability to modify these with little overhead is a priority
- Our chosen analytics platform has a paid option to use SAML authentication out of the box

---

## Considered Options (Authentication - CMS)

- Implement a new SAML service provider as part of the CMS platform (mirroring the same work we did on the portal application)
- **Configure the CMS platform to access the same Redis instance as the portal application, where session data is stored, and use the Portal application login implementation to create a session.**
- Use the default username/password authentication

## Decision Outcome

Configure the CMS platform to access the same Redis instance as the portal application, where session data is stored, and use the Portal application login implementation to create a session.

### Positive Consequences

- We don't have to duplicate the SAML implementation we already set up on the Portal application
- We don't have to ask the SAML Identity Provider to create a new configuration to support another service provider
- Authorized users will be able to seamlessly access both the Portal application and the CMS without having to log in multiple times
- The CMS platform easily allows us to provide an existing session store to use for authentication

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

### Negative Consequences

- We have to pay an ongoing, annual fee to use this plugin
- We have to ask our SAML IdP for a new service provider configuration

## Pros and cons of the other options

### Use the default username/password authentication

- Good, because it requires no changes to the default analytics authentication method
- Good, because username/password is a common, straightforward authentication strategy
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

_The below options assume that we have decided to use CAC authentication for both platforms. For any platform that might use username/password instead, authorization can be handled with the respective platform’s built-in role/permission management capabilities._

- Manage all roles within the SAML identity provider directory
- **Maintain 2 roles within the SAML identity provider directory -- admin, and everyone else -- and further segment "everyone else" into more specific roles managed within each platform**

## Decision Outcome

Maintain 2 roles within the SAML identity provider directory -- admin, and everyone else -- and further segment "everyone else" into more specific roles managed within each platform.

More specifically, with this approach we would create two broad user groups in the SAML IdP directory, i.e. `USSF_PORTAL_ADMIN` and `USSF_PORTAL_SUPPORT` (these names are just examples). Users assigned to the `USSF_PORTAL_ADMIN` group would automatically get full user management permissions on all platforms. All other users who should have any kind of access to the CMS/analytics platform will be assigned to the `USSF_PORTAL_SUPPORT` group.

When a user assigned to the `USSF_PORTAL_SUPPORT` group logs into either platform for the first time, they will automatically receive whatever platform-specific role has the minimum set of permissions. For example, if the analytics platform has the roles `admin, write, read`, a new user would automatically be assigned the `read` role. If they need elevated permissions (such as `write`), a user from the `USSF_PORTAL_ADMIN` group will need to manually add them to that role.

Futhermore, users who aren't in either group (for example, those who have a valid CAC and may still use the Portal application) will be denied access to both CMS and analytics platforms.

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
