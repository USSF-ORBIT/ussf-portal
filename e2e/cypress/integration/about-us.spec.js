import logging from '../plugins/logging'

describe('About Us', () => {
  before(() => {
    cy.loginTestIDP()
  })

  beforeEach(() => {
    cy.preserveLoginCookies()
    cy.visit('/')
    cy.injectAxe()
  })

  it('can visit the About Us page', () => {
    cy.get('button[aria-controls="aboutUsDropdown"]').click()
    cy.findByRole('link', { name: 'About the USSF' }).click()
    cy.url().should('eq', Cypress.config().baseUrl + '/about-us')
    cy.injectAxe()
    cy.findByRole('heading', { level: 1 }).contains('About us')
    cy.findAllByRole('heading', { level: 3, name: 'Essential Reading' }).should(
      'exist'
    )
    cy.findAllByRole('heading', { level: 3, name: 'Mission' }).should('exist')
    cy.findAllByRole('heading', { level: 3, name: 'Leadership' }).should(
      'exist'
    )
    cy.checkA11y(null, null, logging, { skipFailures: true })
  })
})
