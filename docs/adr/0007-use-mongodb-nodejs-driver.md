# Use MongoDB + DocumentDB with Node.js Driver

- Status: Accepted
- Deciders: @suzubara @abbyoung @esacteksab @noahfirth
- Date: 2021-11-01

## Context and Problem Statement

In [ADR #0004](https://github.com/USSF-ORBIT/ussf-portal/blob/main/docs/adr/0004-nosql-for-nexjs.md) we decided to use a NoSQL database for the Next.js application, leaving the specific technologies undecided. We had a preference for MongoDB, but weren't sure how this would translate to a deployed environment in AWS/Cloud One.

This ADR covers the type of NoSQL database and associated tooling to connect the database to our application.

## Decision Drivers

- The database should be compatible with what's available in AWS/Cloud One.
- We want to set the project up for growth and future success if requirements change.
- We want to simplify the development process without sacrificing functionality.

## Considered Options

- Use MongoDB for local development and DocumentDB deployed in AWS.

To communicate with the application, use:

- MongoDB Node.js driver
- Mongoose
- TypeORM
- Prisma

## Decision Outcome

**Use MongoDB and DocumentDB with the MongoDB Node.js driver**

### The Database

DocumentDB is Amazon's cloud-based document database that is compatible with MongoDB and MongoDB tooling. The plan is to use MongoDB in Docker for local development, and a deployed instance of DocumentDB for dev, test, and prod.

### Tooling

This article ["Do you need Mongoose when developing Node.js and MongoDB applications?"](https://www.mongodb.com/developer/article/mongoose-versus-nodejs-driver/) provides a thorough look at the trade-offs between using Mongoose and the native features available via the MongoDB Node.js driver.

> The problem that Mongoose aims to solve is allowing developers to enforce a specific schema at the application layer. In addition to enforcing a schema, Mongoose also offers a variety of hooks, model validation, and other features aimed at making it easier to work with MongoDB.

At one point in time, Mongoose was the all-in-one package for solving these issues. Now, many of these benefits are covered elsewhere in the stack.

We use GraphQL to define schemas and validate our data. If we added Mongoose, we'd essentialy be duplicating our work.

At the database layer, MongoDB now natively supports [Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/).

As for ease of use, the MongoDB Node.js SDK is well-documented, compatible with TypeScript, and pleasant to work with.

### Positive Consequences

- Less tooling, less superfluous code, fewer layers of abstraction
- Excellent documentation and support via MongoDB's community
- By adding validation at the database layer instead of relying on an ODM, the database could more easily be ported to a different tech stack if necessary
- More flexibility during development; the ability to override schema validation requirements if necessary

### Negative Consequences

- Potential for steeper learning curve (although this is based on highly subjective opinions)
- Less common to use MongoDB without Mongoose, meaning many dev resources may not be applicable to our project

## Pros and Cons of Other Options

### Use Mongoose

- Good, because Mongoose is well-established and has extensive documentation and community sypport.
- Neutral, because Mongoose's native TypeScript support is more recent and not extremely well-documented.
- Bad, because it would require duplicating code to redefine schemas and models throughout the application. The application-level validation it would give us is already implemented by GraphQL.

### Use TypeORM

- Bad, because the [feature set is limited](https://typeorm.io/#/mongodb). TypeORM functionality is focused on relational databases.
- Bad, because the documentation is sparse for MongoDB-specific support.

### Use Prisma

- Good, because we're using Prisma elsewhere in the application and we wouldn't have to learn a new tool
- Bad, because Prisma support for MongoDB is still in beta and has a very limited feature set.
