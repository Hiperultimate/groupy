declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
    getById(dataIdAttribute: string): Chainable<JQuery<HTMLElement>>;
    loginNextAuth(loginNextAuthParams : LoginNextAuthParams )
  }
}
