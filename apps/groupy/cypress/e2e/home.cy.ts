/// <reference types="cypress" />

describe("home-page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("displays email and password input box", () => {
    cy.get("[data-test=error-message]").should("have.text", "");

    cy.get("[data-test=email]").type("invalidUser123");
    cy.get("[data-test=password]").type("incorrectpassword");

    cy.get("[data-test=loginBtn]").click();

    cy.get("[data-test=error-message]").should(
      "have.text",
      "Email-ID or Password is incorrect"
    );
  });
});
