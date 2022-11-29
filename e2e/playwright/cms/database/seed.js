// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('pg')

const E2E_TEST_DATABASE = 'test'
const E2E_TEST_CONNECTION = `postgres://keystone:keystonecms@0.0.0.0:5432/${E2E_TEST_DATABASE}`

// DB util functions
const dropAndCreateSchema = async (client) => {
  // Drop
  await client.query(`DROP TABLE IF EXISTS "public"."Event" CASCADE;`)

  // Create schema
  await client.query(`CREATE TABLE "public"."Event" (
    "id" text NOT NULL,
    "operation" text NOT NULL DEFAULT ''::text,
    "itemListKey" text NOT NULL DEFAULT ''::text,
    "itemId" text NOT NULL DEFAULT ''::text,
    "inputData" jsonb,
    "resolvedData" jsonb,
    "changedData" jsonb,
    "originalItem" jsonb,
    "item" jsonb,
    "actor" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);`)

  // Drop
  await client.query(`DROP TABLE IF EXISTS "public"."User" CASCADE;`)

  // Create schema
  await client.query(`CREATE TABLE "public"."User" (
    "id" text NOT NULL,
    "userId" text NOT NULL DEFAULT ''::text,
    "name" text NOT NULL DEFAULT ''::text,
    "isAdmin" bool NOT NULL DEFAULT false,
    "isEnabled" bool NOT NULL DEFAULT false,
    "syncedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" text,
    "createdBy" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);`)

  await client.query(`ALTER TABLE "public"."Event" ADD FOREIGN KEY ("actor") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."User" ADD FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."User" ADD FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
`)

  await client.query(
    `ALTER TABLE "User" ADD COLUMN     "role" "UserRoleType" NOT NULL DEFAULT E'User';`
  )

  // Byline
  await client.query(`DROP TABLE IF EXISTS "public"."Byline" CASCADE;`)

  await client.query(`CREATE TABLE "public"."Byline" (
    "id" text NOT NULL,
    "name" text NOT NULL DEFAULT ''::text,
    "updatedBy" text,
    "createdBy" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Byline_pkey" PRIMARY KEY ("id"));`)

  // Location
  await client.query(`DROP TABLE IF EXISTS "public"."Location" CASCADE;`)

  await client.query(`CREATE TABLE "public"."Location" (
    "id" text NOT NULL,
    "name" text NOT NULL DEFAULT ''::text,
    "updatedBy" text,
    "createdBy" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Location_pkey" PRIMARY KEY ("id"));`)

  // Label
  await client.query(`DROP TABLE IF EXISTS "public"."Label" CASCADE;`)

  await client.query(`CREATE TABLE "public"."Label" (
    "id" text NOT NULL,
    "name" text NOT NULL DEFAULT ''::text,
    "updatedBy" text,
    "createdBy" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Label_pkey" PRIMARY KEY ("id"));`)

  // Tag
  await client.query(`DROP TABLE IF EXISTS "public"."Tag" CASCADE;`)

  await client.query(`CREATE TABLE "public"."Tag" (
    "id" text NOT NULL,
    "name" text NOT NULL DEFAULT ''::text,
    "updatedBy" text,
    "createdBy" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id"));`)

  // Article
  await client.query(`DROP TABLE IF EXISTS "public"."Article" CASCADE;`)

  await client.query(`DROP TYPE IF EXISTS "public"."ArticleStatusType";`)

  await client.query(`DROP TYPE IF EXISTS "public"."ArticleCategoryType";`)

  await client.query(
    `CREATE TYPE "public"."ArticleStatusType" AS ENUM ('Archived', 'Published', 'Draft');`
  )

  await client.query(
    `CREATE TYPE "public"."ArticleCategoryType" AS ENUM ('InternalNews', 'ORBITBlog')`
  )

  await client.query(`CREATE TABLE "public"."Article" (
    "id" text NOT NULL,
    "slug" text NOT NULL DEFAULT ''::text,
    "title" text NOT NULL DEFAULT ''::text,
    "preview" text NOT NULL DEFAULT ''::text,
    "body" jsonb NOT NULL DEFAULT '[{"type": "paragraph", "children": [{"text": ""}]}]'::jsonb,
    "searchBody" text NOT NULL DEFAULT ''::text,
    "status" "public"."ArticleStatusType" NOT NULL DEFAULT 'Draft'::"ArticleStatusType",
    "category" "public"."ArticleCategoryType" NOT NULL,
    "keywords" text NOT NULL DEFAULT ''::text,
    "byline" jsonb NOT NULL DEFAULT '[{"name": ""}]'::jsonb,
    "location" jsonb NOT NULL DEFAULT '[{"name": ""}]'::jsonb,
    "label" jsonb NOT NULL DEFAULT '[{"name": ""}]'::jsonb,
    "tag" jsonb NOT NULL DEFAULT '[{"name": ""}]'::jsonb,
    "updatedBy" text,
    "createdBy" text,
    "updatedAt" timestamp(3),
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP,
    "archivedDate" timestamp(3),
    "publishedDate" timestamp(3),
    CONSTRAINT "Article_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Article_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
`)
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
