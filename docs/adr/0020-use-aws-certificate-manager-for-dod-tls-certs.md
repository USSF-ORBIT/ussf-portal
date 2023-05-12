# Use AWS Certificate Manager for DoD TLS Certificates

* Status: accepted
* Deciders: @gidjin @abbyoung @jcbcapps @minhlai
* Date: 05/10/2023

Technical Story: [Implement an Automated TLS Cert Expiration Notification System](https://app.shortcut.com/orbit-truss/story/1945/implement-an-automated-tls-cert-expiration-notification-system)

## Context and Problem Statement

We currently use DoD Signed TLS Certificates in our AWS Application Load Balancers to authenticate our application with Akamai and GCDS edge servers for all forwarding requests. We are currently managing these certificates in AWS IAM Certificate Manager. However IAM Certificate Manager does not have some features that the newer AWS Certificate Manager (ACM), such as the ability to detect when certificates are about to expire.

## Decision Drivers

* We need an automated system for detecting expiring certificates.

## Considered Options

* Continue using AWS IAM Certificate Manager, and build another means of detecting certificate expirations.
* Switch to using AWS Certificate Manager (ACM), and use AWS' built-in feature.

## Decision Outcome

Chosen option: "Switch to using AWS Certificate Manager (ACM)", because it is the simplest means of automatically notifying us when certificates are about to expire.

### Positive Consequences

* AWS Certificate Manager (ACM) will fire a "ACM Certificate Approaching Expiration" Event via Amazon CloudWatch.
* We can create an AWS EventBridge rule to filter for that event and send a notification to Amazon SNS which will pass the notifaction to our Slack channel #truss-spaceforce-aws-sns
* It is simple to upload the existing DoD Signed TLS Cert into ACM and switch the Application Load Balancer's default TLS certificate.
 

### Negative Consequences 

* There is a cost associated with the other services that support the expiry reminders such as EventBridge, CloudWatch, and SNS.

## Pros and Cons of the Options

### Continue using AWS IAM Certificate Manager

Continue using AWS IAM Certificate Manager, and build another means of detecting certificate expirations.

* Good, because other than notifying on cert expirations, IAM has worked.
* Good, because IAM can be used for certificates in all regions.
  * This is not likely to affect us as we are building an application for US service members and our certificates will always come from the DoD.
* Good, because there are no additional costs though the costs are minor.
* Bad, because it would require additional engineering work to create an AWS Lambda or Fargate Task for detecting Certificate Expirations.
* Bad, because any solution we engineer will not be as well supported as the AWS services that can perform what we need.
* Bad, because AWS recommends using ACM rather than IAM for TLS certificate management if ACM is supported in the region.

### Switch to using AWS Certificate Manager (ACM)

Switch to using AWS Certificate Manager (ACM), and use AWS' built-in feature.

* Good, because we can use all AWS services (EventBridge, CloudWatch, and SNS) to detect cert expirations and notifications.
* Good, because we do not have to write or maintain any code.
* Good, because ACM is the recommendation from AWS.
* Good, because it is simple to have the Application Load Balancer (ALB) cutover to using the ACM managed TLS certificate after it has been uploaded.
* Bad, because ACM does not support certificates from regions outside its [support regions](https://docs.aws.amazon.com/general/latest/gr/acm.html).
  * This is not likely to affect us as we are building an application for US service members and our certificates will always come from the DoD.
* Bad, because there are additional costs in using those AWS Services though they are minor.
* Bad, because we have to modify the existing scripts and documentation regarding how to rotate the TLS Certs on AWS.

## Links

* [Managing server certificates in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html)
* [ACM Certificate Approaching Expiration event](https://docs.aws.amazon.com/acm/latest/userguide/supported-events.html)
* [ACM support regions](https://docs.aws.amazon.com/general/latest/gr/acm.html)

<!-- markdownlint-disable-file MD013 -->
