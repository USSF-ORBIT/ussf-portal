describe('ORBIT Blog', () => {
  before(() => {
    cy.loginTestIDP()
  })

  beforeEach(() => {
    cy.preserveLoginCookies()
    cy.visit('/')
    cy.injectAxe()
  })

  it('can visit the ORBIT Blog page', () => {
    // TODO: Once we have data in CMS test db, we can test
    // that articles and pagination are working as expected.
    cy.visit('/about-us/orbit-blog')
    cy.injectAxe()

    cy.url().should('eq', Cypress.config().baseUrl + '/about-us/orbit-blog')
    cy.findByRole('heading', { level: 1 }).contains('ORBIT Blog')
    cy.findByRole('heading', { level: 2 }).contains(
      'Production team blog & announcements'
    )
  })
})
