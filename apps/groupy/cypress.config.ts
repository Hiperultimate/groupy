import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl : "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event l@isteners here
    },
    viewportHeight: 1000,
    viewportWidth: 1280,
    chromeWebSecurity: false,
  },
  env: {
    GLOBAL_ACCOUNT_EMAIL: "globalUser@gmail.com",
    GLOBAL_ACCOUNT_PASSWORD: "123123123",
    nextauth_secret: "K23pHJ42fhsd11nj3k34",
  },
});
