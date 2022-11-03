// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands'

Cypress.Commands.add(
  'loginTestIDP',
  ({ username, password } = { username: 'user1', password: 'user1pass' }) => {
    cy.clearCookies()

    cy.visit('/login')
    cy.contains('Log In').click()

    // IDP redirects to their login page
    cy.url().should('contain', 'http://localhost:8080/simplesaml/')

    cy.contains('Enter your username and password')
    cy.findByLabelText('Username')
      .clear()
      .type(username)
      .should('have.value', username)
    cy.findByLabelText('Password').type(password)
    cy.contains('Login').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  }
)

Cypress.Commands.add('preserveLoginCookies', () => {
  // auto-preserve session cookie between tests
  Cypress.Cookies.preserveOnce('sid')

  // preserve IDP cookies to auto-login after starting session
  Cypress.Cookies.preserveOnce('SimpleSAMLAuthTokenIdp')
  Cypress.Cookies.preserveOnce('PHPSESSIDIDP')
})
