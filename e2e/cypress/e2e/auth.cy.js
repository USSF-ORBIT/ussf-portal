describe('The Authentication flow', () => {
  describe('access without being logged in', () => {
    it('requires a user to be logged in to view the portal routes', () => {
      cy.clearCookies()
      const routes = ['/', '/sites-and-applications', '/about-us', '/news']

      routes.forEach((url) => {
        cy.visit(url)
        cy.url().should('match', /login/)
      })
    })
  })

  describe('logging in', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/logout').as('logout')

      cy.intercept(
        {
          method: 'GET',
          url: '**/simplesaml/saml2/idp/SingleLogoutService.php*',
        },
        {
          statusCode: 200,
          body: 'Logged out',
        }
      ).as('testIDPLogout')
    })

    it('a user can log into and out of the portal', () => {
      cy.loginTestIDP()
      cy.visit('/')
      cy.contains('My Space')
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      cy.contains('Log out').click()
      cy.wait('@logout')
      cy.wait('@testIDPLogout')

      cy.visit('/')
      cy.url().should('match', /login/)
    })
  })

  describe('access while logged in', () => {
    before(() => {
      cy.loginTestIDP()
    })

    beforeEach(() => {
      cy.intercept('GET', '/api/auth/user').as('getUser')
      cy.preserveLoginCookies()
    })

    it('loads the user on each route', () => {
      const routes = [
        '/',
        '/sites-and-applications',
        '/about-us',
        '/news',
        '/news-announcements',
      ]

      routes.forEach((url) => {
        cy.visit(url)
        cy.wait('@getUser')
          .its('response.statusCode')
          .should('be.oneOf', [200, 304])
      })
    })
  })

  describe('showing user-specific data', () => {
    before(() => {
      // Reset the database
      cy.task('db:seed')
    })

    it('logging in as Test User 1 loads their My Space data', () => {
      cy.loginTestIDP()
      cy.contains('My Space')
      cy.contains('Welcome, BERNADETTE CAMPBELL')
      cy.contains('Example Collection')
      cy.contains('Second Collection')
    })

    it('logging in as Test User 2 loads their My Space data', () => {
      cy.loginTestIDP({ username: 'user2', password: 'user2pass' })
      cy.contains('My Space')
      cy.contains('Welcome, RONALD BOYD')
      cy.contains('Third Collection')
    })
  })
})
