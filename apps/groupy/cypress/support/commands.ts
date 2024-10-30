/// <reference types="cypress" />

Cypress.Commands.add("getByData", (selector: string) => {
  cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add("getById", (selector: string) => {
  cy.get(`[id=${selector}]`);
});
