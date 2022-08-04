/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
/* eslint @typescript-eslint/no-var-requires: "off" */
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const { seedDB } = require('../database/seedMongo')
const storeData = async (data, filepath) => {
  try {
    await mkdirp(path.dirname(filepath))
    // We need to be able to accept a filepath from the reports task
    // so the report can be saved correctly. No user input can
    // reach this function.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFile(filepath, JSON.stringify(data))
  } catch (err) {
    cy.task('log', `Error writing file: ${err}`)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message)

      return null
    },
    table(message) {
      // eslint-disable-next-line no-console
      console.table(message)

      return null
    },
    report({ data }) {
      const filepath = path.resolve('cypress', 'reports/a11y.json')
      storeData(data, filepath)

      return null
    },
    async 'db:seed'() {
      try {
        await seedDB()
        console.log('Database seeded')
      } catch (e) {
        console.log(e)
      }
      return null
    },
  })
}
