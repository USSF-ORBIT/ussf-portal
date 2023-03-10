# Send AWS Cloudwatch Alarms to Slack

* Status: Accepted
- Deciders: @minhlai @gidjin
* Date: 2023-02-08

## Context and Problem Statement

We need to have an appropriate level of metrics monitoring, and alerting in each of our cloud environments so that we can better understand our application, and respond to incidents in a timely manner.

## Decision Drivers

* Capturing AWS Elastic Container Service and (ECS) and Elastic Load Balancer (ELB) metrics will help us better understand our application.
* Creating alarms in AWS Cloudwatch with appropriate thresholds will allow us to be aware of incidents before our clients
* We prefer to not use an AWS service that needs to be requested on Cloud One or require a new IAM user, which has a long lead time for the Cloud One team
* With the AWS services we already have available in Cloud One, AWS Simple Notification Service (SNS) meets our needs and can send Cloudwatch messages to Slack

## Decision Outcome

Chosen option: Use Send AWS Cloudwatch Alarms to Slack
- [+] Each cloud environment will have equivalent alarms setup in AWS Cloudwatch to monitor ECS container resource utilization (memory and CPU) and ELB healthy host count.
- [+] AWS SNS will be setup with a topic and subscription to a Slack channel (#truss-spaceforce-aws-sns) via HTTPS webhook
  - We decided to create a new channel rather than use the existing, #truss-spaceforce-notifications, because that channel already receives other notifications regularly. We wanted to avoid alert fatigue.
  - AWS Cloudwatch sends a JSON object in the message of the alarm to SNS, and then Slack. As of right now, Slack is not able to parse JSON so we must receive the whole message.
- [+] We will only mention @channel in Slack when the notification comes from production Cloud One

### Positive Consequences

* Better understanding of application resource usage
* An alerting system in place to make us aware of outages

### Negative Consequences

* Additional AWS Dev costs

### Future Considerations
* Add email to SNS subscription and have email post to Slack?

<!-- markdownlint-disable-file MD013 -->
