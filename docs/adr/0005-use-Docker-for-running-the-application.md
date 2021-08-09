# Use Docker for running the application

- Status: accepted
- Deciders: @suzubara @abbyoung @esacteksab @noahfirth
- Date: 2021-08-04

## Context and Problem Statement

## Decision Drivers

- Ease of use for developers as well as Infra for deployments to production.
- Immutable artifact for auditing purposes.
- Leverage existing patterns and tooling at Truss.
- Ensure a consistent environment across all the environments (local, dev, test, prod).

## Considered Options

### Local Development

- Development done on local workstation and application (and supporting services) running on local workstation
- Development done inside Docker container and application (and supporting services) running inside Docker container.
- Development done locally and application (and supporting services) running inside a Docker container.

### Production Deployment

- Ship a Docker container as the artifact to be deployed.
- Production server clones local repo and builds locally on production host.
- Ship zip or tarball to remote host, extract and run locally on remote production host.

## Decision Outcome

Development done locally and application (and supporting services) running inside a Docker container. And we are shipping a Docker container as the artifact to be deployed to production. After some discussion, we have decided on these options for the following reasons:

### Local Development

- We sign our commits with a YubiKey or some other mechanism and this doesn't work while using Git inside of Docker.
- Performing Git actions inside of Docker has some sharp edges.
- Having to install Redis, Postgres, and other supporting services locally is more difficult than `docker compose up`.
- Having multiple terminals, running different applications and ensuring there aren't conflicts is more difficult than `docker compose up`.

### Production Deployment

- Allows us to follow other patterns and leverage existing tooling used elsewhere on other Truss projects.
- Allows us to mount a read-only filesystem creating a secure execution environment for the application.
- Produces an immutable artifact that can be traced to a git SHASUM that allows us to know exactly what's inside that container at that build time.
- Ensures consistency between all environments.
- Significantly simpler build and deployment workflow deploying and running a Docker container versus a tarball or cloning the repo locally via git.

See below for full details & pros and cons of each.

## Pros and Cons of the Options <!-- optional -->
### Local Development

### Development done on local workstation and application (and supporting services) running on local workstation

#### Pros

- Don't have the overhead, steep learning curve and/or confusion and difficulty that Docker often brings.

#### Cons

- You have to install everything on your machine, requiring constant care and attention.
- A `brew upgrade` would likely cause a bad day.
- Port conflicts and Apple's Firewall could be a battle.
- Managing mutliple applications and services is more effort than `docker compose up`.
- Possibility of mismatched versions between environments.

### Development done inside Docker container and application (and supporting services) running inside Docker container

#### Pros

- Nice and tidy. _Everything_ is in the container.
- As long as everyone is running the same version of container, everyone has the same environment so should have the same experiences.
- No need to install any applications locally keeping machine more pristine or as pristine as OS X with Docker installed can be.

#### Cons

- _Everything_ is in the container. There is significantly more overhead in managing resources in the container than the application itself.
- Git tasks, including but not limited to 2FA, GPG signing commits, are difficult if not impossible in a Docker container.
- Cognitive overhead in the awareness of what environment you're in (Am I in the Docker container or am I on my local workstation) exists and is a burden.
- Have to learn Docker'isms.
- Sometimes Docker does dumb things, see above.
- Possibility of mismatched versions between environments.

### Development done locally and application (and supporting services) running inside a Docker container

#### Pros

- No need to fight Git & Docker.
- No need to install other services on local workstation keeping machine clean and tidy.
- No need to keep track of what environment (Docker or localhost) you're in.
- As long as everyone has the same Docker file, everyone should have the same experience.

#### Cons

- Have to learn Docker'isms.
- Sometimes Docker does dumb things, see above.
- Possibility between mismatched versions between environments.

### Production Deployment

### Ship a Docker contianer as the artifact to be deployed

#### Pros

- Only the application and the necessary dependencies exist in the container, creating a smaller attack surface.
- Docker container can be mounted with a read-only file system allowing for greater security.
- Deployment and running of a Docker container is far simpler than the other methods mentioned below.
- We can inject secure environment variables at runtime allowing for greater security.
- The same image that's used for local development, verification, testing and validation in dev and test is the same image that goes to production ensuring consistency.

#### Cons

- Docker and its ism's
- In certain environments with certain configurations, its networking and talking to remote services can become a tangled mess.

### Production server clones local repo and builds locally on production host

#### Pros

- It's a well established pattern in the DevOps community with plenty of working examples to copy from.

#### Cons

- Assumes 100% uptime of VCS repository.
- Assumes remote host is capable of reaching VCS repository.
- Requires additional software (git) and its dependencies to be installed on a production server.
- A git clone may pull down more than what's necessary to run the production application resulting in potential vulnerability exploits as well as disk usage.
- Potential for being rate-limited by VCS host or CDN.
- Larger attack surface than a Docker container based on a distroless image.
- Build time is multipled by number of instances leading to longer deployments than a singular artifact (Docker image).

### Ship zip or tarball to remote host, extract and run locally on remote production host

#### Pros

- It's a well established pattern in the DevOps community with plenty of working examples to copy from.
- Requires fewer system applications and dependencies than cloning the repo locally decreasing the potential attack surface.
- Doesn't necessarily have to hit a public host or VCS repository.
- Ensures that only the application and its necessary dependencies are shipped rather than the entire contents of the git repository.

#### Cons

- Requires more than just the application code and dependencies to exist on the server running the application.
- Larger attack surface than a Docker container based on a distroless image.
- Build time is multipled by number of instances leading to longer deployments than a singular artifact (Docker image).
