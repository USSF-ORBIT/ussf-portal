# Prisma/Postgres DB Migrations

This document describes methodology & tips for DB migrations and what pitfalls to avoid for our Keystone CMS application.

## What are database migrations?
Database migrations are a controlled set of changes that modify and evolve the structure of your database schema. Migrations help you transition your database schema from one state to another. For example, within a migration you can create or remove tables and columns, split fields in a table, or add types and constraints to your database.<sup>[1](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model#what-are-database-migrations)


## The Prisma Migrate Command

Prisma Migrate is a commandline database migration tool that allows us to manage database schemas in our local, and development/produciton environments.

### Local Development Environment
In our local environment, we can perform database migrations freely to test our schema.

In our local dev environment, we run migrations via `keystone dev` in our `package.json` file, which will call the Prisma client. This command will<sup>[2](https://keystonejs.com/docs/guides/cli#dev):

- Generate the files required by Keystone's APIs and Admin UI
- Generate and apply database migrations based on your Keystone Schema
- Start the local dev server, which hosts the GraphQL API and Admin UI

 It's important to know the differences between your environments. Be aware that your local database can be reset without adverse effects and that this helpful capability might not be available on remote development/production environments. There are commands like `keystone dev --reset-db` or `prisma migrate reset` which are allowable in local enivironments but should never be run on Production. Locally, you can also delete the Docker volumes that hold your database and start over that way. 

### Dev and Staging/Prod
We host our dev and staging/prod environments on Commercial AWS and Cloud One, respectively. Migrations are run via as startup command in the Dockerfile. Usually it looks something like this:
```
CMD ["/nodejs/bin/node /app/node_modules/.bin/prisma migrate deploy && /nodejs/bin/node -r /app/startup/index.js /app/node_modules/.bin/keystone start"]
```
The sequence of commands is: `prisma migrate deploy` followed by `keystone start`. 

    Q: Why are there two commands instead of one?
    A: Because `keystone start` does not do migrations as it wants to be very careful and explicit about when/if migrations are run in prod.

    Q: Why is `prisma migrate deploy` run in the same step as `keystone start`?
    A: A Dockerfile can run commands before the final startup command, but those commands would be run during build time. We do not have access to the dev/prod database during build time as our Docker Images are built in GitHub Actions runs.

## How Prisma Migrate tracks the migration state
Prisma Migrate uses the following pieces of state to track the state of your database schema<sup>[3](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model#how-prisma-migrate-tracks-the-migration-state):

- Prisma schema: your source of truth that defines the structure of the database schema.
- Migrations history: SQL files in your prisma/migrations folder representing the history of changes made to your database schema.- 
- Migrations table: prisma_migrations table in the database that stores metadata for migrations that have been applied to the database.
- Database schema: the state of the database.

## Migration History
Your migration history is the story of the changes to your data model, and is represented by:
- A prisma/migrations folder with a sub-folder and migration.sql file for each migration:
    ```
    migrations/
      └─ 20210313140442_init/
        └─ migration.sql
      └─ 20210313140442_added_job_title/
        └─ migration.sql
    ```
    The migrations folder is the source of truth for the history of your data model. It should be committed to source control.

- A _prisma_migrations table in the database, which is used to check:
  - If a migration was run against the database
  - If an applied migration was deleted
  - If an applied migration was changed

## Migration Troubleshooting
Sometimes a migration will fail. Each migration in the `_prisma_migrations` table has a logs column that stores the error. The database will not accept any further migrations until the errored migration has either been rolled back or manually marked as completed.

An example of rolling back:

```
prisma migrate resolve --rolled-back "20201127134938_added_bio_index"
```

Rolling back a migration only modifies the logs column of the `_prisma_migrations` table. It does not undo any SQL that may have executed before the migration failed.

If we are unsure of the state of a database schema because of a failed migration we have some options:
1. Restore the database from a snapshot (not an option of Prod)
2. Manually complete or undo the migration (via `prisma db execute` which applies a SQL script) and mark it resolved or rolled back. Right now this has to be done in the Dockerfile. Try the migration again with the bug fix.<sup>[3](https://www.prisma.io/docs/guides/database/production-troubleshooting#failed-migration)
3. A future functionality to run prisma commands against DB?


So far here are the types of failures we have experienced:
1. A migration was applied to the dev/staging database but the migration was not commited to source control. Later the same migration was attempted but with a different migration folder name. This caused the migration to fail as prisma detected that the columns created by that migration already existed. This failed migration prevented us from deploying normally as our Dockerfile attempts `prisma migrate deploy` every time.
   - We resolved this by rolling back the failed 2nd migration and renaming the migration folder to the original name so Prisma did not consider it a new migration
   - We modified the SQL to only create columns if they did not already exist.

## Links:

- [What are database migrations?](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model#what-are-database-migrations)
- [keystone dev](https://keystonejs.com/docs/guides/cli#dev)
- [How Prisma Migrate tracks the migration state](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model#how-prisma-migrate-tracks-the-migration-state)
- [Migration Troubleshooting](https://www.prisma.io/docs/guides/database/production-troubleshooting)
