/// <reference types="cypress" />

describe("signup-page", () => {
  it("login page signup button redirects to signup page", () => {
    cy.visit("/");

    cy.get("[data-test=signupBtn]")
      .should("be.visible")
      .and("not.be.disabled")
      .click();

    cy.url().should("contain", "/sign-up");

    cy.get("[data-test=signup-title]", { timeout: 5000 }).should(
      "have.text",
      "Create your account"
    );
  });
});
