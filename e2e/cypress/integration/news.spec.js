import logging from '../plugins/logging'

describe('News and Announcements', () => {
  before(() => {
    cy.loginTestIDP()
  })

  beforeEach(() => {
    cy.preserveLoginCookies()

    cy.intercept(
      'https://www.spaceforce.mil/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=1060&max=12'
    ).as('getNewsRSS')

    cy.intercept(
      'https://www.spaceforce.mil/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=1060&max=2'
    ).as('getNewsWidgetRSS')

    cy.visit('/')
    cy.injectAxe()
  })

  it('can visit the News page', () => {
    cy.findByRole('link', { name: 'News' }).click()
    cy.url().should('eq', Cypress.config().baseUrl + '/news-announcements')
    cy.injectAxe()
    cy.findByRole('heading', { level: 1 }).contains('News')
    cy.wait('@getNewsRSS')
    cy.findAllByRole('article').should('exist')
    cy.checkA11y(null, null, logging, { skipFailures: true })
  })

  it('can add the News Section to My Space', () => {
    cy.contains('My Space')
    cy.findByRole('button', { name: 'Add section' }).click()
    cy.findByRole('button', { name: 'Add news section' }).click()

    cy.wait('@getNewsWidgetRSS')

    cy.findByRole('heading', { level: 3, name: 'Recent News' }).should('exist')

    cy.contains('Recent News')
      .parent()
      .parent()
      .within(() => {
        cy.findAllByRole('article').should('have.length', 2)
      })

    cy.findByRole('button', { name: 'Add section' }).click()
    cy.findByRole('button', { name: 'Add news section' }).should('be.disabled')
  })

  it('can remove the News Section from My Space', () => {
    cy.contains('My Space')

    cy.contains('Recent News')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Section Settings' }).click()
        cy.findByRole('button', { name: 'Remove this section' }).click()
      })

    // Cancel first to make sure it's possible
    cy.findByRole('dialog', {
      name: 'Are you sure you’d like to delete this section?',
    }).within(() => {
      cy.findByRole('button', { name: 'Cancel' }).click()
    })

    // Reopen modal
    cy.contains('Recent News')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Section Settings' }).click()
        cy.findByRole('button', { name: 'Remove this section' }).click()
      })

    // Delete
    cy.findByRole('dialog', {
      name: 'Are you sure you’d like to delete this section?',
    }).within(() => {
      cy.findByRole('button', { name: 'Delete' }).click()
    })

    // Make sure it has been deleted
    cy.contains('Recent News').should('not.exist')
  })
})
