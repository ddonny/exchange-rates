/// <reference types="Cypress" />

context('Visiting', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:3000', {
      timeout: 10000
    })
  })

  it('.have base amount 1.0000', () => {
    cy.get('.base-amount-not-edit')
      .should('have.text', '1.0000')
  })
  it('.have base currency USD', () => {
    cy.get('.header-wrapper .text-2')
      .should('have.text', 'USD')
  })

  it('.have conversion list rendered correctly', () => {
    cy.get('.list-wrapper')
      .should('have.class', 'list-wrapper')
  })

  it('.have conversion list 4 as default', () => {
    cy
    .get('.list-group .list-group-item')
    .its('length')
    .should('eq', 4)
  })

  it('.element for add new currency rendered', () => {
    cy
    .get('.selections-add-more-conversion')
    .should('have.class', 'selections-add-more-conversion')
  })

})
