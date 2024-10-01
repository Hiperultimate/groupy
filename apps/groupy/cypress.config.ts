import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl : "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event l@isteners here
    },
    viewportHeight: 720,
    viewportWidth: 1280,
  },
  env: {
    GLOBAL_ACCOUNT_EMAIL: "globalUser@gmail.com",
    GLOBAL_ACCOUNT_PASSWORD: "123123123",
  },
});
