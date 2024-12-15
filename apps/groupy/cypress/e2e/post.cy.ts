import { type ICypressUser } from "cypress/support/commands";

describe("home-page-posts", () => {
  it("Checking login through JWT", () => {
    cy.fixture<ICypressUser>("users/user1.json").then((user) => {
      cy.visit("/");

      cy.loginNextAuth({
        userData : user,
        provider: "credentials",
      });
    });
  });
});
