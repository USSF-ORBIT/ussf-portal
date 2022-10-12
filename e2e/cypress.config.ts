import { defineConfig } from 'cypress'
import pluginSetup from './cypress/plugins/index.js'

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 768,
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return pluginSetup(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
