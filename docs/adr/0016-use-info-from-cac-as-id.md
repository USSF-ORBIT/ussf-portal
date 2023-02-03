# Use info from CAC as id

* Status: Accepted
* Deciders: @gidjin @abbyoung @jcbcapps
* Date: 2023-01-09

Technical Story: https://app.shortcut.com/orbit-truss/story/1218/hash-user-id-s-for-privacy

## Context and Problem Statement

[ADR 0008 - auth architecture](./0008-auth-architecture.md) and [ADR 0009 - platform authentication and authorization](./0009-platform-auth-architecture.md) decision records detail our use of SAML based authentication to allow users to sign in with their CAC into the portal. As a result of that method we need to link user's data with the user information provided by the SAML authentication process. This is to return user specific links, configuration, and provided for authorization as necessary to access the CMS and edit content.

Within the returned data for a fully authenticated user is the user's name, EDI-PI, and domain. This in the format `NAMEA.NAMEB.123456789@testusers.cce.af.mil` (note this is a made up one). This provides a unique identifier for the authenticated user that this doc will refer to as `CAC ID`.

## Decision Drivers

* Some identifier is needed to connect a SAML authenticated user with data stored for them in our system
* The identifier should already be sent by the SAML provider since that is not under our control
* We may need to share this identifier with other parties so nothing that shouldn't be shared can be used
* All requests to our application and its APIs are behind the authentication wall, thus even someone possessing the **CAC ID** of another user would still be unable to access any information beyond what they are allowed.
* All requests requiring authenticated access or user id use the **CAC ID** of the user that is stored server side in session data

## Considered Options

* Use the **CAC ID** as included in the SAML provider response stored in plain text
* Use the **CAC ID** as included in the SAML provider response stored in one-way-hashed form
* Use the **CAC ID** to connect a user but also store a custom unique identifier, such as database generated UUID.

## Decision Outcome

Chosen option: "Use the CAC ID as included in the SAML provider response stored in plain text"

This option is the lightest lift to get a user connected with the data stored in our system without introducing features we don't need. The **CAC ID** does contain some personal information, but as noted in the official documents about DoD ID this information is not high risk PII and currently we store no other personal information. Additionally we currently do not have any third party to share the identifier with we can always re-evaluate the need for a UUID we generate to avoid giving the **CAC ID** to the third party. That said we can store the **CAC ID** and a custom UUID for third parties at the same time. I've included relevant quotes below.


> The DoD ID number, by itself or with an associated name, shall be considered internal government operations-related PII. Since the loss, theft or compromise of the DoD ID number is low risk for possible identity theft or fraud, a PII breach report will not be initiated unless accompanied by other PII elements, such as date of birth, birthplace or mother’s maiden name, which would normally require a report to be submitted.

> To ensure that the DoD ID number maintains its low-risk category as PII and does not become a vulnerability like the use of an individual’s Social Security number (SSN) — another high-risk personal identifier — the DoD ID number will only be used as one factor in a multifactor authentication process. In this way, knowledge of the DoD ID number alone does not grant access to records unless accompanied by another factor such as a pin number or biometric.

## Pros and Cons of the Options

### Use the **CAC ID** stored in plain text

Just store the **CAC ID** in our database and use it to connect users to their data.

* Good, because lowest lift of effort
* Good, because **CAC ID** is already unique for our purposes
* Bad, because storing some extra PII than strictly necessary
* Bad, because sending the DoD ID to a non DoD entity requires a Memorandum of Understanding

### Use the **CAC ID** stored in one-way-hashed form

Store the **CAC ID** in our database after running it through a one way hash, such as sha512, and use it to connect users to their data.

* Good, because **CAC ID** is already unique for our purposes
* Good, because we are not storing some extra PII in plain text
* Bad, because PII is just obscured not removed
* Bad, because every authentication request will need to hash the id

### Use the **CAC ID** to connect a user but also store a custom unique identifier, such as database generated UUID.

Similar to the first option but use the **CAC ID** strictly for connecting a user to their data and access. Display and third parties would recieve the UUID if needed.

* Good, because third party doesn't get DoD ID, which can be an issue if there isn't a Memorandum of Understanding with them
* Good, because **CAC ID** is already unique for our purposes
* Bad, because storing some extra PII than strictly necessary

## Links

* [ADR 0008 - auth architecture](./0008-auth-architecture.md)
* [ADR 0009 - platform authentication and authorization](./0009-platform-auth-architecture.md)
* [CIO of the Navy blog post](https://www.doncio.navy.mil/chips/ArticleDetails.aspx?ID=4034)
* [Memo on DoD ID use](https://www.esd.whs.mil/Portals/54/Documents/DoD%20Identification%20Number_20180710.docx?ver=2018-07-10-121214-930)
  * note this is a word docx file


<!-- markdownlint-disable-file MD013 -->