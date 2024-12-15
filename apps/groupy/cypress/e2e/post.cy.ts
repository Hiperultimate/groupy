import { type ICypressUser } from "cypress/support/commands";

describe("home-page-posts", () => {
  it("Checking login through JWT", () => {
    cy.fixture<ICypressUser>("users/user1.json").then((user) => {
      cy.visit("/");

      // groupy\apps\groupy\cypress\support\commands.ts -> loginNextAuth params to pass user data from cypress fixtures
      cy.loginNextAuth({
        userData : user,
        provider: "credentials",
      });
    });
  });
});
