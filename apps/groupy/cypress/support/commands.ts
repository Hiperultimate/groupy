/// <reference types="cypress" />

import { v4 as uuidv4 } from "uuid";
import { encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

Cypress.Commands.add("getByData", (selector: string) => {
  cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add("getById", (selector: string) => {
  cy.get(`[id=${selector}]`);
});

//https://dev.to/cowofevil/speed-up-cypress-testing-of-nextauth-secured-web-apps-10a0
Cypress.Commands.add(
  "loginNextAuth",
  ({ userData, provider }: LoginNextAuthParams) => {
    const {id : userId, name, email , tags, atTag, dateOfBirth, description, picture} = userData;
    
    Cypress.log({
      displayName: "NEXT-AUTH LOGIN",
      message: [`🔐 Authenticating | ${name}`],
    });

    const dateTimeNow = Math.floor(Date.now() / 1000);
    const expiry = dateTimeNow + 30 * 24 * 60 * 60; // 30 days
    const cookieName = "next-auth.session-token";
    // Add data like userTags, userSummary, userNameTag , image which you can get from nextauth credentials
    const cookieValue: JWT = {
      name: name,
      email: email,
      tags: tags,
      atTag: atTag,
      dateOfBirth: new Date(dateOfBirth), // Requires error checking
      description: description,
      id: userId,
      picture:picture,
      provider: provider,
      tokenType: "Bearer",
      accessToken: "dummy",
      iat: dateTimeNow,
      exp: expiry,
      jti: uuidv4(),
    };

    // https://docs.cypress.io/api/utilities/promise#Waiting-for-Promises
    cy.wrap(null, { log: false }).then(() => {
      return new Cypress.Promise((resolve, reject) => {
        encode({
          token: cookieValue,
          secret: Cypress.env("nextauth_secret") as string,
        })
          .then((encryptedCookieValue) => {
            cy.setCookie(cookieName, encryptedCookieValue, {
              log: false,
              httpOnly: true,
              path: "/",
              expiry: expiry,
            });
            resolve();
          })
          .catch((e) => {
            console.log("Encoding rejected : ", e);
            reject();
          });
      });
    });
  }
);

export type ICypressUser = {
  id: string;
  name: string;
  email: string;
  tags: Array<{ id: string; name: string }>;
  atTag: string;
  dateOfBirth: string;
  description: string;
  picture: string;
};

export type LoginNextAuthParams = {
  userData: ICypressUser;
  provider: "credentials";
};