# USSF Portal

# Table of Contents

* [About the Project](#about-the-project)
    * [Our Philosophy](#our-philosophy-and-process)
    * [Portal Links](#portal-links)
    * [Repository Directory](#repository-directory)
* [Developer Resources](#developer-resources)
    * [Documentation](#documentation)
    * [E2E Testing](#end-to-end-testing)
* [USSF Design](#ussf-design)

## About the Project

### Our philosophy and process

The Space Force service portal was created hand-in-hand with the people who will engage with the service portal itself: Space Force personnel. The TrussWorks contracting team that designed and engineered this platform conducted research with more than 100 Guardians, spending hundreds of hours learning about what Guardians need (and don’t need) in a portal. This early and continual focus on Guardians helped the team understand Space Force personnel’s preferences on topics such as connecting easily to frequently used websites or applications, news & events, frequently accessed forms, and staying up to date on military requirements, to name a few.

The team at TrussWorks strongly believes in building products based on feedback from the people who will actually be interacting with them, and using a process that allows the team to deliver a prototype and make improvements with small, frequent delivery cycles. Our agile delivery method helps the team effectively prioritize features and which problems to tackle (and in what order). If we find ourselves suddenly moving in an unhelpful direction, agile also allows us to make quick course corrections based on direct Guardian feedback. Our team has found that putting Space Force personnel at the center of our decision-making helps build not only a better product, but also helps build trust in government services.

**As a team we value…**

- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Customer collaboration over contract negotiation
- Responding to change over following a plan

### Portal Links

USSF Portal:
* Dev: https://dev.ussforbit.us
* Staging: https://staging.my.spaceforce.mil
* Production: https://my.spaceforce.mil

CMS for USSF Portal:
* Dev: https://cms.ussforbit.us
* Staging: https://staging.cms.spaceforce.mil
* Production: https://cms.spaceforce.mil

To run the portal on your local machine, please see the [Developer Documentation](https://github.com/USSF-ORBIT/ussf-portal/blob/bddc7caa5f2d272d6ade5db9098705ba70a59a7e/docs/development.md).

### Repository Directory
- [USSF Portal Client](https://github.com/USSF-ORBIT/ussf-portal-client)
- [USSF Portal CMS](https://github.com/USSF-ORBIT/ussf-portal-cms)
- [USSF Analytics](https://github.com/USSF-ORBIT/analytics)
- [USSF Personnel API](https://github.com/USSF-ORBIT/ussf-personnel-api)
- [USSF Third Party API](https://github.com/USSF-ORBIT/ussf-portal/tree/main/test-jwt-service)
- [Spacecadets Dev (Infrastructure)](https://github.com/USSF-ORBIT/spacecadets-dev)

## Developer Resources

### Documentation
Refer to the [`docs/README.md`](https://github.com/USSF-ORBIT/ussf-portal/blob/bddc7caa5f2d272d6ade5db9098705ba70a59a7e/docs/README.md) for important links to [developer documentation](https://github.com/USSF-ORBIT/ussf-portal/blob/main/docs/development.md), how-tos, and architectural decision records. If you're a software engineer working on any part of the application, [this README](https://github.com/USSF-ORBIT/ussf-portal/blob/bddc7caa5f2d272d6ade5db9098705ba70a59a7e/docs/README.md) is the page to bookmark.

### End to End Testing

End to end (E2E) testing is an important part of our software engineering practice. It helps us ensure that all the various components of the system can interact together properly. It also helps raise our confidence in upgrades and improvements as they are built. Since our E2E testing spans more than one application (e.g. the portal-client and portal-cms repositories) and are dependant on all those applications the E2E tests live in this repository.

## USSF Design

Read more about the design process behind the portal: [Design Elements](https://github.com/USSF-ORBIT/ussf-portal/blob/bddc7caa5f2d272d6ade5db9098705ba70a59a7e/design-elements.md).

The USSF Design System can be viewed via Storybook at https://storybook.ussforbit.us/
