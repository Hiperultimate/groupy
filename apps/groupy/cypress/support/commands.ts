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

export type LoginNextAuthParams = {
  userId: string;
  name: string;
  email: string;
  provider: "credentials";
};

//https://dev.to/cowofevil/speed-up-cypress-testing-of-nextauth-secured-web-apps-10a0
Cypress.Commands.add(
  "loginNextAuth",
  ({ userId, name, email, provider }: LoginNextAuthParams) => {
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
      tags: [{ id: "891asd", name: "temp" }],
      atTag: "GlobalUser",
      dateOfBirth: new Date(),
      description: "placeholder description",
      id: userId,
      picture: "http://127.0.0.1:54321/storage/v1/object/public/images/displayPictures/19cd7cb5-84a1-4725-a4a6-9205eba171c4.jpeg",
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
