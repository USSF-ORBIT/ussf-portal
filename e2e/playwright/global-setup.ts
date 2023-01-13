import { FullConfig } from '@playwright/test'
import {
  defaultUser,
  adminUser,
  authorUser,
  managerUser,
} from './cms/database/users'

import { seedDB } from './portal-client/database/seedMongo'

import { createOrUpdateUsers } from './cms/database/seed'
async function globalSetup(config: FullConfig) {
  await createOrUpdateUsers([defaultUser, adminUser, authorUser, managerUser])
  // false tells the function to *not* reset the db, since nothing exists yet
  await seedDB(false)
}

export default globalSetup
