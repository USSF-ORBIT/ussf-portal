# SAML Groups

We use 4 SAML groups for controlling access to the portal. This document describes their use.

## Groups

- PORTAL_Analytics_Admins		
- PORTAL_CMS_Admins		
- PORTAL_CMS_Users		
- PORTAL_SUPERADMINS

### PORTAL_Analytics_Admins		

This group is UNUSED currently. The intention is people in this group would have access to matomo. This is dependent on setting up the SAML plugin for matomo and integrating it with the SAML server we use.

No need to add people to this group until that plugin is setup.

### PORTAL_CMS_Admins

This group contains all users who have CMS admin access. Adding users to this group is how users get the `isAdmin` flag set in the CMS.

### PORTAL_CMS_Users		

This group contains all users of the CMS who are not admins. This includes `CMS users`, `CMS Authors`, and `CMS Managers`. If you need to add someone who has one of these roles add them to this group. You can assign the role to them before they sign in if you grab their `UPN` after adding them to the `PORTAL_CMS_Users` group and create an account using that as their `userId`

### PORTAL_SUPERADMINS

This group is how we manage access to adjust the SAML groups. Users in this group can add and remove users from all four groups described in this document.

## Notes

A user does not need to be in both the `PORTAL_CMS_Users` and `PORTAL_CMS_Admins`, only one is enough. Adding a user to `PORTAL_SUPERADMINS` only gives a user access to modify the groups NOT CMS access. Typically admins end up in both admin groups.

### Definitions

#### SAML - Security Assertion Markup Language

SAML (Security Assertion Markup Language) is a an XML standard that allows secure web domains to exchange user authentication and authorization data. See [detailed documentation](https://support.google.com/a/answer/6262987?hl=en). Part of what the identity server provides are a way to manage user groups so that different authorization can be done based on the groups.

#### SLAM - Super Lightweight Authorization Management

We use SLAM (Super Lightweight Authorization Management) to control who is in which group. This is a tool made available by our identity provider to allow us to self manage the SAML groups created for our application. For [Production we use this instance](https://slam.cce.af.mil/slam-ui/groups) for [Staging and Development this server](https://slam.test.cce.af.mil/slam-ui/groups).
