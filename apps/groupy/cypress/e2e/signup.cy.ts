/// <reference types="cypress" />

function returnCypressDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(
    2,
    "0"
  )}-${String(date.getMonth()).padStart(2, "0")}`;
}

describe("signup-page-form", () => {
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

    // Getting form input fields
    const nameField = getNameField();
    const emailField = getEmailField();
    const passwordField = getPasswordField();
    const confirmPasswordField = getConfirmPasswordField();
    const dobField = getDobField();
    const tagNameField = getTagNameField();
    const userDescriptionField = getUserDescriptionField();
    const tagSelectField = getTagSelectField();
    const imageField = getImageField();
    const formSubmitButton = getFormSubmitButton();

    // Setting value for form inputs
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    nameField.type("Mi");
    emailField.type("jo.com@gmail");
    passwordField.type("123123123123123123123");
    confirmPasswordField.type("1234567");
    dobField.type(returnCypressDate(futureDate));
    tagNameField.type("mi");
    userDescriptionField.type("Optional");
    tagSelectField.type("Tag 1{enter}");
    tagSelectField.type("Tag 2{enter}");
    imageField.selectFile("cypress/fixtures/images/bad-image.iso", {
      force: true,
    });
    formSubmitButton.click();

    //Checking if the error messages are as required
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
    const inputErrors = cy.getByData("input-error");

    inputErrors.each(($el, index) => {
      cy.wrap($el)
        .invoke("text")
        .then((text) => {
          cy.log(`Error ${index + 1}: ${text}`);
        });
    });

    inputErrors.each(($el, index) => {
      cy.wrap($el).invoke("text").should("eq", expectedFieldError[index]);
    });

    // Testing file size restraint for image input
    imageField.selectFile("cypress/fixtures/images/large-size-image.jpg", {
      force: true,
    });
    formSubmitButton.click();

    cy.getByData("input-error")
      .last()
      .invoke("text")
      .should("eq", "Image size must be less than 1 MB");
  });

  // it("Check if errors go away once the user has entered valid inputs", () => {})
});
