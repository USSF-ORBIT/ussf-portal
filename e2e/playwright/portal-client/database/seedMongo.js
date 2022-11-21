// MongoClient used by Cypress tests
/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb')
const { testUser1, testUser2 } = require('./users.js')

const DB = 'mongo-e2e'

async function dropCollection(mongoClient, collectionName) {
  const collection = mongoClient.db(DB).collection(collectionName)

  await collection.drop().catch((e) => {
    console.log('error when dropping', e)
    if (e.code !== 26) {
      throw e
    }
  })
}

async function seedCollection(mongoClient, collectionName, jsonData) {
  const collection = mongoClient.db(DB).collection(collectionName)
  await collection.insertOne(jsonData)
}

module.exports.seedDB = async () => {
  // Connection URL
  const uri = `mongodb://localhost:27017`

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()

    await dropCollection(client, 'users')
    await seedCollection(client, 'users', testUser1)
    await seedCollection(client, 'users', testUser2)

    console.log(`${DB} database seeded!`)

    client.close()
  } catch (err) {
    console.log(err.stack)
    return err
  }
}
