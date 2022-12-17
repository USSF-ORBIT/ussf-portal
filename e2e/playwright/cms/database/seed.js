// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg')

const E2E_TEST_DATABASE = 'test'
const E2E_TEST_CONNECTION = `postgres://keystone:keystonecms@0.0.0.0:5432/${E2E_TEST_DATABASE}`

// DB util functions
const dropAndCreateSchema = async (client) => {
  // Drop
  await client.query(`TRUNCATE TABLE "public"."Event" CASCADE;`)

  // Drop
  await client.query(`TRUNCATE TABLE "public"."User" CASCADE;`)

  // Byline
  await client.query(`TRUNCATE TABLE "public"."Byline" CASCADE;`)

  // Location
  await client.query(`TRUNCATE TABLE "public"."Location" CASCADE;`)

  // Label
  await client.query(`TRUNCATE TABLE "public"."Label" CASCADE;`)

  // Tag
  await client.query(`TRUNCATE TABLE "public"."Tag" CASCADE;`)

  // Article
  await client.query(`TRUNCATE TABLE "public"."Article" CASCADE;`)
}

// DB exports
module.exports.resetDb = async () => {
  const client = new Client({ connectionString: E2E_TEST_CONNECTION })

  try {
    await client.connect()
    await dropAndCreateSchema(client)
    console.log(`E2E database reset!`)
    await client.end()
  } catch (err) {
    console.log(err.stack)
    return err
  }
}

module.exports.seedRevokeUsers = async () => {
  const client = new Client({ connectionString: E2E_TEST_CONNECTION })

  try {
    await client.connect()
    await dropAndCreateSchema(client)

    // These users are intentionally out-of-sync with their access in the test users SAML file for testing purposes
    await client.query(`INSERT INTO "public"."User" ("id", "name", "isAdmin", "isEnabled", "role", "userId") VALUES
('cl0jylky70105fs97hvb6sc7x', 'RONNY', 'f', 't', 'User', 'RONALD.BOYD.312969168@testusers.cce.af.mil'),
('cl0jyfow10002fs97yimqq04c', 'JOHN HENKE', 't', 't', 'User', 'JOHN.HENKE.562270783@testusers.cce.af.mil'),
('cl0jylky79105fs97hvb6sc7x', 'FLOYD KING', 't', 't', 'User', 'FLOYD.KING.376144527@testusers.cce.af.mil');`)

    console.log(`E2E database seeded!`)

    await client.end()
  } catch (err) {
    console.log(err.stack)
    return err
  }
}

module.exports.seedGrantUsers = async () => {
  const client = new Client({ connectionString: E2E_TEST_CONNECTION })

  try {
    await client.connect()
    await dropAndCreateSchema(client)

    // These users are intentionally out-of-sync with their access in the test users SAML file for testing purposes
    await client.query(`INSERT INTO "public"."User" ("id", "name", "isAdmin", "isEnabled", "role", "userId") VALUES
('cl0jyfow10002fs97yimqq04c', 'JOHN HENKE', 'f', 'f', 'User', 'JOHN.HENKE.562270783@testusers.cce.af.mil'),
('cl0jylky79105fs97hvb6sc7x', 'FLOYD KING', 'f', 'f', 'User', 'FLOYD.KING.376144527@testusers.cce.af.mil');`)

    console.log(`E2E database seeded!`)

    await client.end()
  } catch (err) {
    console.log(err.stack)
    return err
  }
}

module.exports.seedCMSUsers = async () => {
  const client = new Client({ connectionString: E2E_TEST_CONNECTION })

  try {
    await client.connect()
    await dropAndCreateSchema(client)

    // Seed CMS test users for each role
    await client.query(`INSERT INTO "public"."User" ("id", "name", "isAdmin", "isEnabled", "role", "userId") VALUES
('cl0jylky79105fs97hvb6sc7x', 'FLOYD KING', 't', 't', 'User', 'FLOYD.KING.376144527@testusers.cce.af.mil'),
('cl31ovlaw0013mpa8sc8t88pp', 'ETHEL NEAL', 'f', 't', 'Author', 'ETHEL.NEAL.643097412@testusers.cce.af.mil'),
('cl396pfxe0013moyty5r5r3z9', 'CHRISTINA HAVEN', 'f', 't', 'Manager', 'CHRISTINA.HAVEN.561698119@testusers.cce.af.mil');`)

    console.log(`CMS users seeded!`)

    await client.end()
  } catch (err) {
    console.log(err.stack)
    return err
  }
}
