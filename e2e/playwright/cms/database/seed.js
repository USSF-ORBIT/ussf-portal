// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg')

const E2E_TEST_DATABASE = 'test'
const E2E_TEST_CONNECTION = `postgres://keystone:keystonecms@0.0.0.0:5432/${E2E_TEST_DATABASE}`

const createOrUpdateUserQuery = ({
  id,
  name,
  isAdmin,
  isEnabled,
  role,
  userId,
}) => {
  return `
    INSERT INTO "public"."User" ("id", "name", "isAdmin", "isEnabled", "role", "userId") VALUES
    ('${id}','${name}','${isAdmin}','${isEnabled}','${role}','${userId}')
    ON CONFLICT ("userId") DO UPDATE SET 
    "userId" = excluded."userId",
    "name" = excluded."name",
    "isAdmin" = excluded."isAdmin",
    "isEnabled" = excluded."isEnabled",
    "role" = excluded."role";
    `
}

export const createOrUpdateUsers = async ([...users]) => {
  const client = new Client({ connectionString: E2E_TEST_CONNECTION })
  const queries = []
  try {
    await client.connect()

    users.forEach(async (u) => {
      const query = createOrUpdateUserQuery(u)
      queries.push(client.query(query))
    })

    await Promise.all(queries)

    await client.end()
  } catch (err) {
    console.error(err.stack)
    return err
  }
}
