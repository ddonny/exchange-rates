/// <reference types="Cypress" />

describe('when base amount change from 1 USD to 2 USD, may be failed if it does have connection problem', () => {
  let oldRateWithBaseAmount1USD
  let newRateWithBaseAmount2USD
  beforeEach(() => {
    cy.visit('http://127.0.0.1:3000', {
      timeout: 20000
    })
    cy.wait(3000).get('.list-group .list-group-item:nth-child(1) .conversion-wrapper .conversion-section-1 .area-1 .amount-conversion div').invoke('text').then((text) => {
      let rawText = text
      oldRateWithBaseAmount1USD = rawText.replace(/\,/g,'')
    });
    // change input to 2 USD
    cy.wait(7000).get('.header-wrapper .wrapper-2 .base-amount-not-edit').click()
    cy.get('.header-wrapper .wrapper-2 #base-amount-field-input').clear().type('2').blur()
    cy.wait(3000).get('.list-group .list-group-item:nth-child(1) .conversion-wrapper .conversion-section-1 .area-1 .amount-conversion div').invoke('text').then((text) => {
      let rawText = text
      newRateWithBaseAmount2USD = rawText.replace(/\,/g,'')
    });
  })

  it('conversion rate for element 1 should changed twice or more than before', () => {
    expect(Number(newRateWithBaseAmount2USD)).to.be.greaterThan(Number(oldRateWithBaseAmount1USD))
  })

})
