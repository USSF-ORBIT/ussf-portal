/* Cypress doesn't like visiting multiple origins in a single test :( */
describe('SAML flow (with test IdP)', () => {
  before(() => {
    // Make sure all cookies are cleared before logging in
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.preserveLoginCookies()
  })

  it('returns null if there is no current user', () => {
    cy.getCookie('sid').should('not.exist')
    cy.request({ url: '/api/auth/user', failOnStatusCode: false })
      .its('status')
      .should('eq', 401)
  })

  it('can login to the test SAML IDP', () => {
    cy.getCookie('sid').should('not.exist')

    cy.visit('/api/auth/login')

    // IDP redirects to their login page
    cy.url().should('contain', 'http://localhost:8080/simplesaml/')

    cy.contains('Enter your username and password')
    cy.findByLabelText('Username').type('user1')
    cy.findByLabelText('Password').type('user1pass')
    cy.contains('Login').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.getCookie('sid').should('exist')
  })

  it('auto-logs in if the IDP session already exists', () => {
    cy.visit('/api/auth/login')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.getCookie('sid').should('exist')
  })

  it('can request the current user', () => {
    cy.getCookie('sid').should('exist')

    // Cypress is being dumb and for some reason not attaching the sid cookie to the request even though it exists!
    // https://docs.cypress.io/api/commands/request#Cookies
    cy.getCookies()
      .should('have.length', 3)
      .then((cookies) => {
        const cookieString = cookies.reduce((prev, cur) => {
          return prev + `${cur.name}=${cur.value}; `
        }, '')

        cy.request({
          url: '/api/auth/user',
          headers: {
            Cookie: cookieString,
          },
        })
          .its('status')
          .should('eq', 200)
      })
  })

  it('can log out', () => {
    cy.getCookie('sid').should('exist')
    cy.request('/api/auth/logout')
    cy.getCookie('sid').should('not.exist')
  })
})
