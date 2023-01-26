# Authentication Strategy & Architecture

- Status: Accepted
- Deciders: @suzubara @abbyoung @esacteksab @noahfirth
- Date: 2021-11-02

Technical Story: https://github.com/USSF-ORBIT/ussf-portal-client/issues/289

## Context and Problem Statement

The current USSF portal website uses a headless authentication method wherein no user data is provided to the application, and all users have equal access. Many of the new application features we are planning require us to have some identifying knowledge of a user when they log in, as well as the concept of user groups and permissions in order to give access to content administrators in the future. In order to implement these features, we will need to set the portal application up as a SAML service provider, and use session-based authentication.

Because the decision of how to implement SAML is also somewhat tied to how we manage sessions, this ADR describes both pieces of our authentication architecture in tandem.

## Decision Drivers

- We are required to use SAML for authentication due to external circumstances, and to leverage existing authentication providers and user directories.
- We want to avoid storing as much PII or sensitive data as possible.
- We want to use tools that will be compatible with our existing tech stack (NextJS, Express.js, MongoDB/DocumentDB).
- We don't want to implement a SAML service provider from scratch.

## Considered Options

### SAML service provider library

#### **[passport-saml](https://github.com/node-saml/passport-saml)**

- A provider built for [Passport](http://www.passportjs.org/), a commonly used authentication library for NodeJS apps
- Since Passport is middleware, which NextJS does not support out of the box, this approach also requires adding [next-connect](https://github.com/hoangvvo/next-connect) to expose middleware handlers in server-side code. While I'd normally prefer to avoid this kind of overhead, a tool like this will be useful for other things as our app grows, for example adding common handlers for API routes such as for authorization and error handling
- Unlike Next-auth, Passport _only_ handles the authentication mechanism, so it will still be up to us to manage user sessions
- I also added **[passport-saml-metadata](https://github.com/compwright/passport-saml-metadata)**, a utility helper for getting IdP configuration (including certs) from metadata XML. (I don't know if an equivalent helper exists for `saml2-js` but I also didn't look very hard). This will let us change IdP settings just based on the XML path, and avoid having to install and rotate certs ourselves.

#### **[next-auth](https://github.com/nextauthjs/next-auth)**

- Next-auth is an all-in-one authentication solution for NextJS applications. This was a tempting option since it is specifically built to work with NextJS and wouldn't require adding a library for injecting middleware.
- Next-auth does _not_ have a SAML implementation out of the box. I specifically investigated [this example](https://github.com/Jenyus-Org/next-auth-saml) which creates a custom credentials provider using [saml2-js](https://github.com/Clever/saml2).
- Ultimately I decided to move forward with `passport-saml` instead for the following reasons:
  - `next-auth` looks to be more of an all-encompassing solution for authentication in NextJS apps -- it is also responsible for managing sessions in a database and handling the authentication API routes (login, sign up, logout, etc.). It seems to be designed as a one-size-fits-all for applications that may be supporting multiple or more traditional log in methods (such as OAuth or username/password), which frankly seems like overkill for our purposes, since we only need to implement SAML (for now).
  - It requires a CSRF token in POST requests, which isn't present in a SAML response. The example code I linked above gets around this by generating an HTML form and submitting it as part of the response handler, which felt hacky and unnecessary.
  - Since Next-auth handles sessions it requires either configuring a database, or storing data in a JWT. Next-auth does not have a database adapter for Redis, so we would need to build that ourselves.

While Next-auth _would_ do more for us than Passport, I'm inclined to stick with Passport at least for now. I believe it will give us more fine-grained control over our authentication flows and handling user data, and right now we don't have the use case of needing to integrate with multiple authentication strategies. There is no reason why we could not migrate from Passport to Next-auth in the future, since the configuration details of the SAML service provider wouldn't change. But I think for now, as we are still feeling out the needs and architecture of this application, it'll be simpler to use Passport.

### Application authentication method

#### Session-based

With session-based auth, a user's session information is persisted on the backend and a session ID is sent in a cookie to keep a user logged in after authentication. This requires implementing a log out handler and session timeout on both the client and browser to make sure sessions are expired, and session data is cleaned up. By authenticating with SAML, a session has also been created on the IdP and is managed similarly, so session-based auth in the portal application would follow the same pattern.

In this situation we can use an in-memory data store such as Redis to avoid storing sensitive data long term. This is a common and recommended strategy for persisting session data.

#### Token-based

With token-based authentication, all session-related data is stored in an encrypted token in the client, and decrypted using a secret key on the server. This removes the need to store session data on the server at all, and can be a useful strategy when scaling to support multiple authentication clients or many users at a time.

However, it also limits our control over sessions; for example we would not be able to imperatively expire a single session as needed. Implementing token auth is also more initial development overhead, and since traditional sessions are already being managed as part of the SAML flow, introducing token-based auth on top of that would complicate our architecture unnecessarily.

Finally, nothing prohibits us from migrating to token-based auth in the future if we decide to.

#### References:

- https://redis.com/solutions/use-cases/session-management/
- [Session Management in Nodejs Using Redis as Session Store](https://medium.com/swlh/session-management-in-nodejs-using-redis-as-session-store-64186112aa9)
- [The Ultimate Guide to Passport JS](https://dev.to/zachgoll/the-ultimate-guide-to-passport-js-k2l)

## Decision Outcome

We will impement the SAML service provider using [passport-saml](https://github.com/node-saml/passport-saml), and manage traditional sessions, storing session-data in Redis.
