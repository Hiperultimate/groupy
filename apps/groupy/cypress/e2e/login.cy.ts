/// <reference types="cypress" />

describe("login-page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays email and password input box and check for error message for invalid user", () => {
    cy.get("[data-test=error-message]").should("have.text", "");

    cy.get("[data-test=email]").type("invalidUser123@gmail.com");
    cy.get("[data-test=password]").type("incorrectpassword");

    cy.get("[data-test=loginBtn]").click();

    cy.get("[data-test=error-message]").should(
      "have.text",
      "Email-ID or Password is incorrect"
    );
  });

  it("can log user in for correct login credentials", () => {
    cy.get("[data-test=email]").type(
      Cypress.env("GLOBAL_ACCOUNT_EMAIL") as string
    );
    cy.get("[data-test=password]").type(
      Cypress.env("GLOBAL_ACCOUNT_PASSWORD") as string
    );

    cy.get("[data-test=loginBtn]").click();

    cy.url().should("include", "/home");

    cy.get("[data-test=nameTag]", { timeout: 10000 }).should(
      "have.text",
      "@globalUser10000"
    );
  });
});
