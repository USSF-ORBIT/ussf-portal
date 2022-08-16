import logging from "../plugins/logging";

describe("Routes & navigation", () => {
  describe("logged in pages", () => {
    before(() => {
      cy.loginTestIDP();
    });

    beforeEach(() => {
      cy.preserveLoginCookies();
    });

    it("can navigate to the home page", () => {
      cy.visit("/");
      cy.injectAxe();
      cy.contains("Welcome, BERNADETTE CAMPBELL");
      cy.contains("My Space");

      // Check a11y
      cy.checkA11y(null, null, logging, { skipFailures: true });

      // Check meta data
      cy.document();
      cy.get("head title").should("contain", "Space Force Portal");
    });

    it("can navigate to the News & Announcments page", () => {
      cy.visit("/news-announcements");
      cy.injectAxe();
      cy.contains("Latest external USSF news");
      cy.checkA11y(null, null, logging, { skipFailures: true });
    });

    it("can navigate to the internal News page", () => {
      cy.visit("/news");
      cy.injectAxe();
      cy.contains("All USSF news");
      cy.checkA11y(null, null, logging, { skipFailures: true });
    });

    it("can navigate to the About Us page", () => {
      cy.visit("/about-us");
      cy.injectAxe();
      cy.contains("About the Space Force");
      cy.checkA11y(null, null, logging, { skipFailures: true });
    });

    it("can navigate to the Sites & Applications page", () => {
      cy.visit("/sites-and-applications");
      cy.injectAxe();
      cy.contains("Sites & Applications");
      cy.checkA11y(null, null, logging, { skipFailures: true });
    });
  });

  describe("logged out pages", () => {
    beforeEach(() => {
      cy.clearCookies();
    });

    it("can visit the login page", () => {
      cy.visit("/login");
      cy.injectAxe();
      cy.contains("Space Force Portal Login");
      cy.checkA11y(null, null, logging, { skipFailures: true });
    });
  });
});
