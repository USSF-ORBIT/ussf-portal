import logging from '../plugins/logging'

describe('Sites and Applications', () => {
  before(() => {
    // Reset the database
    cy.task('db:seed')
    cy.loginTestIDP()
  })

  beforeEach(() => {
    cy.preserveLoginCookies()
    cy.visit('/')
    cy.injectAxe()
  })

  it('can add a new custom collection', () => {
    cy.findByRole('button', { name: 'Add section' }).click()
    cy.findByRole('button', { name: 'Create new collection' }).click()
    cy.findByLabelText('Collection Title').type('My New Collection{enter}')
    cy.contains('My New Collection')
  })

  it('can visit the Sites & Applications page', () => {
    cy.contains('My Space')

    // Client-side navigate to the page
    cy.contains('All sites & applications').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/sites-and-applications')
    cy.injectAxe()
    cy.contains('Sites & Applications')

    const collections = [
      'Career',
      'Personnel & Administration',
      'Medical & Dental',
      'Life & Fitness',
      'PCS',
      'Finance & Travel',
      'Outprocessing',
      'Management',
      'vMPF',
      'Supervisory',
      'Education',
      'Public Social Platforms',
      'Public Military Websites',
    ]
    collections.forEach((collection) => cy.contains(collection))

    // Toggle sorting
    cy.contains('Sort by type').should('be.disabled')
    cy.contains('Sort alphabetically').click()
    cy.contains('Sort by type').should('be.enabled')
    cy.contains('Sort alphabetically').should('be.disabled')
    cy.contains('Application name')
    // Check for a url description
    cy.contains('Automated Computer Program Identification Number System')
    // cy.findAllByRole('row').should('have.length', 311)

    cy.contains('Sort by type').click()
    cy.contains('Career')
    cy.contains('Application name').should('not.exist')
    cy.checkA11y(null, null, logging, { skipFailures: true })
  })

  it('can add collections from the Sites & Applications page to My Space', () => {
    cy.contains('My Space')
    cy.findByRole('heading', { level: 3, name: 'Career' }).should('not.exist')
    cy.findByRole('heading', {
      level: 3,
      name: 'Medical & Dental',
    }).should('not.exist')
    cy.findByRole('heading', {
      level: 3,
      name: 'Life & Fitness',
    }).should('not.exist')

    // Go to Sites & Applications
    cy.findByRole('button', { name: 'Add section' }).click()

    cy.findByRole('button', {
      name: 'Select collection from template',
    }).click()

    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/sites-and-applications?selectMode=true'
    )

    cy.findByRole('button', { name: 'Select collection Career' }).click()
    cy.findByRole('button', {
      name: 'Select collection Medical & Dental',
    }).click()
    cy.findByRole('button', {
      name: 'Select collection Life & Fitness',
    }).click()
    cy.contains('3 collections selected')

    cy.findByRole('button', {
      name: 'Unselect collection Medical & Dental',
    }).click()
    cy.contains('2 collections selected')

    cy.findByRole('button', { name: 'Add selected' }).click()

    // Go back to My Space
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.contains('My Space')
    cy.findByRole('heading', { level: 3, name: 'Career' }).should('exist')
    cy.findByRole('heading', {
      name: 'Life & Fitness',
      level: 3,
    }).should('exist')
    cy.findByRole('heading', {
      name: 'Medical & Dental',
      level: 3,
    }).should('not.exist')
  })

  it('can add links to a new collection from the Sites & Applications page', () => {
    // Client-side navigate to the page
    cy.contains('All sites & applications').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/sites-and-applications')
    cy.contains('Sites & Applications')

    // Toggle sorting
    cy.contains('Career')
    cy.contains('Sort alphabetically').click()

    cy.contains('Move.mil')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Add to My Space Closed' }).click()
        cy.contains('Add to new collection').click()
      })

    // Go back to My Space
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    cy.findByLabelText('Collection Title').type(
      'My Second New Collection{enter}'
    )
    cy.contains('My Second New Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('Move.mil')
      })
  })

  it('can add links to an existing collection from the Sites & Applications page', () => {
    // Client-side navigate to the page
    cy.contains('All sites & applications').click()

    cy.url().should('eq', Cypress.config().baseUrl + '/sites-and-applications')
    cy.contains('Sites & Applications')

    // Toggle sorting
    cy.contains('Career')
    cy.contains('Sort alphabetically').click()

    cy.contains('SURF')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Add to My Space Closed' }).click()
        cy.contains('Example Collection').click()
      })

    cy.contains(
      'You have successfully added “SURF” to the “Example Collection” section.'
    )

    // Go back to My Space
    cy.contains('My Space').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.findByRole('heading', { name: 'My Space' })
    cy.contains('Example Collection')
      .parent()
      .parent()
      .next()
      .within(() => {
        cy.contains('SURF')
      })
  })

  it('can hide links from an existing collection', () => {
    cy.contains('My Space')

    cy.contains('Example Collection')
      .parent()
      .parent()
      .next()
      .within(() => {
        // Inside of <ol>
        cy.get('[aria-label="Drag Handle"]').should('have.length', 6)
        cy.contains('Webmail')

        // First undo
        cy.findAllByRole('button', { name: 'Remove this link' }).first().click()
        cy.contains('Webmail').should('not.exist')
        cy.contains('Undo remove').click()
        cy.contains('Webmail')

        // Don't undo
        cy.findAllByRole('button', { name: 'Remove this link' }).first().click()
        cy.contains('Webmail').should('not.exist')
        cy.contains('Undo remove').should('not.exist')

        // The number is 6 because vMPF doesn't exist, but the drag handle for it still does
        cy.get('[aria-label="Drag Handle"]').should('have.length', 5)
      })
  })

  it('can add existing links to an existing collection', () => {
    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('link', {
          name: 'ADP (opens in a new window)',
        }).should('not.exist')

        // Add a link
        cy.findByRole('button', { name: '+ Add link' }).click()
        cy.findByLabelText('Select existing link').click() // Open the select
        cy.findByRole('option', { name: 'ADP' }).click()

        /*
        cy.findByRole('link', {
          name: 'ADP (opens in a new window)',
        }).should('exist')
        */
      })
  })

  it('can add custom links to an existing collection', () => {
    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // Add a link
        cy.findByRole('button', { name: '+ Add link' }).click()
        cy.findByRole('button', { name: 'Add a custom link' }).click()
      })

    cy.findByRole('dialog', { name: 'Add a custom link' }).within(() => {
      cy.findByRole('button', { name: 'Cancel' }).click()
    })

    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // Add a link
        cy.findByRole('button', { name: '+ Add link' }).click()
        cy.findByRole('button', { name: 'Add a custom link' }).click()
      })

    cy.findByRole('dialog', { name: 'Add a custom link' }).within(() => {
      cy.findByLabelText('Name')
        .then(($el) => $el[0].checkValidity())
        .should('be.false')

      cy.findByLabelText('Name')
        .type('My Custom Link')
        .then(($el) => $el[0].checkValidity())
        .should('be.true')

      cy.findByLabelText('URL')
        .then(($el) => $el[0].checkValidity())
        .should('be.false')

      cy.findByLabelText('URL')
        .type('not a URL')
        .then(($el) => $el[0].checkValidity())
        .should('be.false')

      cy.findByLabelText('URL')
        .clear()
        .type('https://google.com')
        .then(($el) => $el[0].checkValidity())
        .should('be.true')

      cy.findByRole('button', { name: 'Save custom link' }).click()
    })

    cy.contains('My Custom Link')
  })

  it('can edit custom links', () => {
    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // Edit a link
        cy.findAllByRole('button', { name: 'Edit this link' }).first().click()
      })

    cy.findByRole('dialog', { name: 'Edit custom link' }).within(() => {
      cy.findByRole('button', { name: 'Cancel' }).click()
    })

    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // Edit a link
        cy.findAllByRole('button', { name: 'Edit this link' }).first().click()
      })

    cy.findByRole('dialog', { name: 'Edit custom link' }).within(() => {
      cy.findByLabelText('Name').should('have.value', 'My Custom Link')
      cy.findByLabelText('Name').clear().type('Edited Custom Link')
      cy.findByLabelText('URL').should('have.value', 'https://google.com')
      cy.findByLabelText('URL').clear().type('https://example.com')
      cy.findByRole('button', { name: 'Save custom link' }).click()
    })

    cy.findByRole('link', {
      name: 'Edited Custom Link (opens in a new window)',
    }).should('exist')
  })

  it('can delete custom links', () => {
    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // Edit a link
        cy.findAllByRole('button', { name: 'Edit this link' }).first().click()
      })

    cy.findByRole('dialog', { name: 'Edit custom link' }).within(() => {
      cy.findByRole('button', { name: 'Delete' }).click()
    })

    cy.findByRole('link', {
      name: 'Edited Custom Link (opens in a new window)',
    }).should('not.exist')

    cy.contains('Example Collection')
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get('[aria-label="Drag Handle"]').should('have.length', 6)
      })
  })

  it('can edit an existing collection title', () => {
    cy.contains('Example Collection')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Collection Settings' }).click()
        cy.findByRole('button', { name: 'Edit collection title' }).click()

        cy.findByRole('textbox').clear()
        cy.findByRole('textbox').type('Updated Title{enter}')
        cy.contains('Updated Title')
          .parent()
          .within(() => {
            cy.findByRole('heading', {
              level: 3,
            }).should('have.text', 'Updated Title')
          })
      })
  })

  it('can remove multiple links at once from an existing collection', () => {
    cy.contains('My Space')

    cy.contains('Updated Title')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // Inside of <ol>
        // Start with 7 links, remove 2
        cy.get('[aria-label="Drag Handle"]').should('have.length', 6)

        cy.contains('vMPF').next().click()
        cy.contains('LeaveWeb').next().click()

        cy.contains('vMPF').should('not.exist')
        cy.contains('LeaveWeb').should('not.exist')

        cy.get('[aria-label="Drag Handle"]').should('have.length', 4)
      })
  })

  it('can delete an existing collection', () => {
    cy.contains('My Second New Collection')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Collection Settings' }).click()

        cy.findByRole('button', { name: 'Delete this collection' }).click()
      })

    // Cancel first to make sure it's possible
    cy.findByRole('dialog', {
      name: 'Are you sure you’d like to delete this collection from My Space?',
    }).within(() => {
      cy.findByRole('button', { name: 'Cancel' }).click()
    })

    // Reopen the modal
    cy.contains('My Second New Collection')
      .parent()
      .parent()
      .within(() => {
        cy.findByRole('button', { name: 'Collection Settings' }).click()

        cy.findByRole('button', { name: 'Delete this collection' }).click()
      })

    // Delete the collection
    cy.findByRole('dialog', {
      name: 'Are you sure you’d like to delete this collection from My Space?',
    }).within(() => {
      cy.findByRole('button', { name: 'Delete' }).click()
    })

    // Make sure no collection exists
    cy.contains('My Second New Collection').should('not.exist')
  })
})
