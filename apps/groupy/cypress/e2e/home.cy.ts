/// <reference types="cypress" />

describe('home-page', () => {
  beforeEach(() => {
    cy.visit('https://localhost:3000/')
  })
  
  it('displays email and password input box', () => {

    cy.get('.todo-list li').should('have.length', 2)

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    cy.get('[data-test=email]').first().should('have.text', 'Pay electric bill')
    cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  })


})
