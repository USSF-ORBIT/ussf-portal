# MongoDB Migrations

The portal client application uses MongoDB (AWS DocDB in deployed environments) as a data store for _non-sensitive_ user data. If you need to make a change that requires a database migration, follow these steps:

- As much as possible, consider how to scope the migration to its own branch / PR so it can be deployed independently of application code changes, and reinforce backwards compatibility to minimize the risk of errors in production.
  - This may require making code changes so the application can handle both the existing & changed data model _before_ running migrations.
  - Resource: [The pedantic checklist for changing your data model in a web application](https://rtpg.co/2021/06/07/changes-checklist.html)
- On your migration branch, run the following command to create a new migration:
  - `yarn migrate:create <migration name here>`
  - Example: `yarn migrate:create add-type-to-collections`
  - This will generate a new migration file with a timestamp under the `./migrations` directory
  - Give your migration an explicit & descriptive name
- Create a corresponding test file for migration under `./test/migrations`
  - Example: `./test/migrations/add-type-to-collections.test.js`
- Write your migration `up` and `down` code, and corresponding tests
  - The `up, down` functions are passed into the `runMigration` utility function, which will handle connecting to MongoDB, pass the `db` context into the migration, and close the connection afterwards.
- Test your migration in Jest
  - We use the [jest-mongodb preset](https://github.com/shelfio/jest-mongodb) so unit tests will run against a shared in-memory MongoDB instance
- Test your migration in MongoDB
  - If you connect to your local MongoDB instance (for example, using [mongo-express](http://localhost:8888/)) you can verify the data changes as expected when you run & rollback migrations
  - To run new migrations: `yarn migrate` or `yarn migrate up <migration name>`
  - To rollback: `yarn migrate down` or `yarn migrate down <migration name>`
  - To view the status of all migrations: `yarn migrate list`
  - Resources: [Documentation for node-migrate](https://github.com/tj/node-migrate)
- Test your migration in the application
  - The migrate script is run automatically when the application server starts (in all environments: development, production, and in Docker) as part of the startup script.
  - Start up the application in these environments to make sure the migration runs successfully and does not cause an error.
  - This will also be tested in the Cypress CI workflow, which builds & starts the application in Docker.