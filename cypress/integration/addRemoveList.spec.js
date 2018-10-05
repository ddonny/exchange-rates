/// <reference types="Cypress" />

context('Add remove List', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:3000', {
      timeout: 10000
    })
  })

  it('list become 5 after add new currency', () => {
    cy.get('.selections-add-more-conversion').click();
    cy.get('.selections-add-more-conversion .dropdown-menu .dropdown-item:nth-child(1)').click();
    cy.get('.selections-add-more-conversion .submit').click();
    cy
    .get('.list-group .list-group-item')
    .its('length')
    .should('eq', 5)
  })

  it('deleted from default 4 become 3', () => {
    cy.get('.list-group .list-group-item:nth-child(1) .conversion-section-2 button').click();
    cy
    .get('.list-group .list-group-item')
    .its('length')
    .should('eq', 3)
  })

})
