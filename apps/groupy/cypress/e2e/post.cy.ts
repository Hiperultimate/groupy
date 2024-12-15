describe("home-page-posts", () => {
  it("Checking login through JWT", () => {
    cy.fixture<{ id: string; name: string; email: string }>(
      "users/user1.json"
    ).then((user) => {
      cy.visit("/");
      
      // groupy\apps\groupy\cypress\support\commands.ts -> loginNextAuth params to pass user data from cypress fixtures
      cy.loginNextAuth({
        userId: user.id,
        name: user.name,
        email: user.email,
        provider: "credentials",
      });
    });

  });
});
