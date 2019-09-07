const url = "http://localhost:3000";

describe("Step You validations", () => {
  it("lands on the form page", () => {
    cy.visit(url);
  });
  it("has first_name field", () => {
    cy.get('input[name="first_name"]');
  });
  it("has last_name field", () => {
    cy.get('input[name="last_name"]');
  });
  it("has email field", () => {
    cy.get('input[name="email"]');
  });
  it("has git_profile field", () => {
    cy.get('input[name="git_profile"]');
  });
  it("has phone_number field", () => {
    cy.get('input[name="phone_number"]');
  });
  it("has live_in_uk field", () => {
    cy.get('input[name="live_in_uk"]');
  });
  it("should not proceed if First Name is not filled.", () => {
    cy.visit(url);
    cy.get('input[name="last_name"]').type("Doe");
    cy.get('input[name="email"]').type("john@doe.com");
    cy.get('input[name="git_profile"]').type("johndoe");
    cy.get('input[name="phone_number"]').type("07567412589");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("not.be.visible");
  });
  it("should not proceed if Email is not filled.", () => {
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="last_name"]').type("Doe");
    cy.get('input[name="git_profile"]').type("johndoe");
    cy.get('input[name="phone_number"]').type("07567412589");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("not.be.visible");
  });
  it("should not proceed if Git Profile is not filled.", () => {
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="last_name"]').type("Doe");
    cy.get('input[name="email"]').type("john@doe.com");
    cy.get('input[name="phone_number"]').type("07567412589");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("not.be.visible");
  });
  it("should not proceed if user try to click on CV button", () => {
    cy.visit(url);
    cy.get("#steps")
      .contains("CV")
      .click();
  });
  it("should show error message when user try to go to step two without filling all required fields.", () => {
    cy.contains("Please complete all required fields.");
  });
});

describe("Step CV validations", () => {
  it("should NOT allow user to upload .xls file", () => {
    // go to step 2
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="email"]').type("john@doe.com");
    cy.get('input[name="git_profile"]').type("johndoe");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("be.visible");
    cy.contains("Next").click();

    const fileName = "test.xls";
    const fileType = "application/vnd.ms-powerpoint";
    const fileInput = "input[data-cy=cv]";

    cy.upload_file(fileName, fileType, fileInput);
  });

  it("should show error message when file is not supported", () => {
    cy.contains("File format not supported.");
  });

  it("should allow user to process two Step two if all required fields on step 1 are filled.", () => {
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="email"]').type("john@doe.com");
    cy.get('input[name="git_profile"]').type("johndoe");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("be.visible");
  });

  it("should allow user to upload .pdf file", () => {
    cy.contains("Next").click();
    const fileName = "test.pdf";
    const fileType = "application/pdf";
    const fileInput = "input[data-cy=cv]";

    cy.upload_file(fileName, fileType, fileInput);
  });

  it("should remove the uploaded item when remove button is clicked", () => {
    cy.contains("delete").click();
  });

  it("should allow user to upload .doc file", () => {
    // go to step 2
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="email"]').type("john@doe.com");
    cy.get('input[name="git_profile"]').type("johndoe");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("be.visible");
    cy.contains("Next").click();

    const fileName = "test.doc";
    const fileType = "application/msword";
    const fileInput = "input[data-cy=cv]";

    cy.upload_file(fileName, fileType, fileInput);
  });
  it("should allow user to upload .ods file", () => {
    // go to step 2
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="email"]').type("john@doe.com");
    cy.get('input[name="git_profile"]').type("johndoe");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("be.visible");
    cy.contains("Next").click();

    const fileName = "test.ods";
    const fileType =
      "application/application/vnd.oasis.opendocument.spreadsheet";
    const fileInput = "input[data-cy=cv]";

    cy.upload_file(fileName, fileType, fileInput);
  });

  it("should allow user to upload .pptx file", () => {
    // go to step 2
    cy.visit(url);
    cy.get('input[name="first_name"]').type("John");
    cy.get('input[name="last_name"]').type("Doe");
    cy.get('input[name="email"]').type("123456789");
    cy.get('input[name="git_profile"]').type("JohnDoe");
    cy.get('input[name="live_in_uk')
      .first()
      .click();
    cy.get(".myform__submit").should("be.visible");
    cy.contains("Next").click();

    const fileName = "test.pptx";
    const fileType = "application/vnd.ms-powerpoint";
    const fileInput = "input[data-cy=cv]";

    cy.upload_file(fileName, fileType, fileInput);
  });
  it("should not proceed if user try to click on Done button", () => {
    cy.get("#steps")
      .contains("Done")
      .click();
    cy.contains("Please complete all required fields.");
  });

  it("should proceed if About you is filled.", () => {
    cy.get(".myform__textarea").type("Lorem ipsum dolor sit amet");
    cy.get(".myform__submit").should("be.visible");
    cy.contains("Done").click();
  });
});

describe("Step Done validations", () => {
  it("should show error message from the server because email address is invalid, and about you is too short.", () => {
    cy.contains("Submit").click();
    cy.contains("The given data was invalid.");
    cy.contains("The email must be a valid email address.");
    cy.contains("The about you must be at least 100 characters.");
  });

  it("should return successful when all criteria are met.", () => {
    cy.contains("You").click();
    cy.get('input[name="first_name"]')
      .clear()
      .type("Anson");
    cy.get('input[name="last_name"]')
      .clear()
      .type("Cheung");
    cy.get('input[name="email"]')
      .clear()
      .type("ansoncwork@gmail.com");
    cy.get('input[name="git_profile"]')
      .clear()
      .type("ansonhkg");
    cy.contains("CV").click();
    cy.get(".myform__textarea")
      .clear()
      .type(
        "“Absorb what is useful, discard what is useless and add what is specifically your own” ― Bruce Lee, Bruce Lee"
      );
    cy.contains("Done").click();
    cy.contains("Submit").click();
  });
});
