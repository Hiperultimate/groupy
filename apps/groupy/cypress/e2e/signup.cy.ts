/// <reference types="cypress" />

describe("signup-page-form", () => {
  it("login page signup button redirects to signup page", () => {
    cy.visit("/");

    cy.getByData("signupBtn")
      .should("be.visible")
      .and("not.be.disabled")
      .click();

    cy.url().should("contain", "/sign-up");

    cy.get("[data-test=signup-title]", { timeout: 5000 }).should(
      "have.text",
      "Create your account"
    );
  });

  it("Checking existance of required input fields in signup page", () => {
    cy.visit("/sign-up");
    getNameField().should("be.visible").should("be.enabled");
    getEmailField().should("be.visible").should("be.enabled");
    getPasswordField().should("be.visible").should("be.enabled");
    getConfirmPasswordField().should("be.visible").should("be.enabled");
    getDobField().should("be.visible").should("be.enabled");
    getTagNameField().should("be.visible").should("be.enabled");
    getUserDescriptionField().should("be.visible").should("be.enabled");
    getTagSelectField().should("be.visible").should("be.enabled");

    getImageField().should("be.enabled");
    getFormSubmitButton().should("be.visible").should("be.enabled");
  });

  it("Checking errors of input fields invalid input errors", () => {
    cy.visit("/sign-up");

    const expectedFieldErrorArr = fillInvalidSignupInput();
    getFormSubmitButton().click();
    checkErrorMessages(cy.getByData("input-error"), expectedFieldErrorArr);

    // Testing file size restraint for image input
    getImageField().selectFile("cypress/fixtures/images/large-size-image.jpg", {
      force: true,
    });
    getFormSubmitButton().click();

    cy.getByData("input-error")
      .last()
      .invoke("text")
      .should("eq", "Image size must be less than 1 MB");
  });

  it("Check if errors go away once the user has entered valid inputs", () => {
    cy.visit("/sign-up");

    const possibleErrors = fillInvalidSignupInput();
    getFormSubmitButton().click();
    cy.getByData("input-error").should("have.length", possibleErrors.length);

    // Clear values function here
    clearSignupInput();

    fillValidSignupInput();
    cy.getByData("input-error").should("have.length", 0);
  });

  it("Check if users can create new accounts through sign-up and access the home page after successfully logging in", () => {
    cy.visit("/sign-up");

    const { email, password, tagname } = fillValidSignupInput();

    // Check for request sent to create account creation
    cy.intercept("POST", "**api/trpc/account.signup*").as("signupRequest");

    getFormSubmitButton().click();

    cy.wait("@signupRequest").its("response.statusCode").should("eq", 200);

    // Check if user reached the home page
    cy.url().should("contain", "/");

    // Login with those credentials
    cy.getByData("email").type(email);
    cy.getByData("password").type(password);
    cy.getByData("loginBtn").click();

    // Check if we have reached the home page successfully
    cy.url().should("contain", "/home");
    cy.getByData("nameTag").invoke("text").should("contain", tagname);
  });
});

// Helper functions
const getNameField = () => cy.getByData("name-input");
const getEmailField = () => cy.getByData("email-input");
const getPasswordField = () => cy.getByData("password-input");
const getConfirmPasswordField = () => cy.getByData("confirmPassword-input");
const getDobField = () => cy.getByData("dob-input");
const getTagNameField = () => cy.getByData("tagName-input");
const getUserDescriptionField = () => cy.getByData("userDescription-input");
const getTagSelectField = () => cy.getById("tagSelect-input");
const getImageField = () => cy.getByData("image-input");
const getFormSubmitButton = () => cy.getByData("signupSubmit-btn");

function checkErrorMessages(
  inputErrors: Cypress.Chainable<JQuery<HTMLElement>>,
  expectedErrors: string[]
) {
  inputErrors.each(($el, index) => {
    cy.wrap($el).invoke("text").should("eq", expectedErrors[index]);
  });
}

function fillInvalidSignupInput() {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  // Setting incorrect values to all inputs
  getNameField().type("Mi");
  getEmailField().type("jo.com@gmail");
  getPasswordField().type("123123123123123123123");
  getConfirmPasswordField().type("1234567");
  getDobField().type(returnCypressDate(futureDate));
  getTagNameField().type("mi");
  getUserDescriptionField().type("Optional");
  getTagSelectField().type("Tag 1{enter}");
  getTagSelectField().type("Tag 2{enter}");
  getImageField().selectFile("cypress/fixtures/images/bad-image.iso", {
    force: true,
  });

  // These are the errors you can expect after filling the form with above values
  const expectedFieldError = [
    "String must contain at least 3 character(s)",
    "Invalid email",
    "String must contain at most 16 character(s)",
    "String must contain at least 8 character(s)",
    "Passwords do not match",
    "Birth date must be in the past",
    "String must contain at least 3 character(s)",
    "You must select at least 3 tags.",
    "Invalid file",
    "Invalid image format",
  ];
  return expectedFieldError;
}

function fillValidSignupInput() {
  const olderDate = new Date();
  olderDate.setFullYear(olderDate.getFullYear() - 10);

  const randomNumber = Date.now();
  const email = `hamster${randomNumber}@test.com`;
  const password = String(randomNumber);
  const username = `Hamster${randomNumber}`;
  const tagname = `hamst3r:${randomNumber}`;

  // Setting valid values to all inputs
  getNameField().type(username);
  getEmailField().type(email);
  getPasswordField().type(password);
  getConfirmPasswordField().type(password);
  getDobField().type(returnCypressDate(olderDate));
  getTagNameField().type(tagname);
  getUserDescriptionField().type(
    "Crawling groupy since the birth of hamsters <:3 )~~"
  );
  getTagSelectField().type("nerdy{enter}");
  getTagSelectField().type("hamster{enter}");
  getTagSelectField().type("on-the-web{enter}");
  getImageField().selectFile("cypress/fixtures/images/valid-image.jpg", {
    force: true,
  });

  return {
    email,
    password,
    username,
    tagname,
  };
}

function clearSignupInput() {
  // Removing older tags from multiselect
  cy.get(`[aria-label^="Remove"]`).each(($el) => {
    cy.wrap($el).click();
  });

  getNameField().clear();
  getEmailField().clear();
  getPasswordField().clear();
  getConfirmPasswordField().clear();
  getDobField().clear();
  getTagNameField().clear();
  getUserDescriptionField().clear();

  // Clears input field for getImageField
  getImageField().then((input) => {
    (input[0] as HTMLInputElement).value = "";
  });
}

function returnCypressDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(
    2,
    "0"
  )}-${String(date.getMonth()).padStart(2, "0")}`;
}
