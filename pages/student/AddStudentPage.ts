import { Page, Locator } from '@playwright/test';

export interface StudentDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string; // e.g. 'Male' / 'Female' — confirm exact label in the app
  dobYear: number;
  category: string; // OBC | SC | ST | GENERAL | MINORITY | OTHER
}

export interface AcademicDetails {
  className: string; // '5' .. '10'
  section: string; // 'A' / 'B'
  admissionType: string; // 'New admission'
}

export interface AddressDetails {
  country: string; // 'India'
  state: string; // 'Delhi'
  city: string; // 'Delhi'
  pinCode: string;
  addressLine1: string;
  addressLine2: string;
}

export interface GuardianDetails {
  relationType: string; // 'Father'
  firstName: string;
  lastName: string;
  dobYear: number;
  phone: string;
  email: string;
  docType: string; // 'Aadhaar Card'
  docNumber: string;
}

export class AddStudentPage {
  readonly page: Page;

  // Navigation
  readonly studentNavLink: Locator;
  readonly openAddStudentButton: Locator;
  readonly nextButton: Locator;
  readonly reviewAddStudentButton: Locator;
  readonly submitButton: Locator;

  // Step 1 - Student basic details
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly genderDropdown: Locator;
  readonly dobDatePicker: Locator;
  readonly categoryDropdown: Locator;

  // Step 2 - Academic details
  readonly admissionDateDatePicker: Locator;
  readonly classDropdown: Locator;
  readonly sectionDropdown: Locator;
  readonly admissionTypeDropdown: Locator;

  // Step 3 - Address details
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly pinCodeInput: Locator;
  readonly addressLine1: Locator;
  readonly addressLine2: Locator;

  // Step 4 - Guardian details
  readonly relationTypeDropdown: Locator;
  readonly guardianFirstNameInput: Locator;
  readonly guardianLastNameInput: Locator;
  readonly guardianDobDatePicker: Locator;
  readonly guardianPhoneInput: Locator;
  readonly guardianEmailInput: Locator;
  readonly docTypeDropdown: Locator;
  readonly docNumberInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.studentNavLink = page.locator('a[routerlink="/student"]');
    // Initial "Add Student" button (opens the wizard) has no ng-star-inserted class,
    // unlike the "Next"/final "Add Student" buttons inside the wizard.
    this.openAddStudentButton = page.locator('button.add-btn:not(.ng-star-inserted)', {
      hasText: 'Add Student',
    });
    this.nextButton = page.getByRole('button', { name: 'Next', exact: true });
    this.reviewAddStudentButton = page.getByRole('button', { name: 'Add Student', exact: true }).last();
    this.submitButton = page.getByRole('button', { name: 'Confirm & Add', exact: true });

    // Step 1 (use .first() — same formcontrolnames are reused for guardian in step 4)
    this.firstNameInput = page.locator('input[formcontrolname="firstName"]').first();
    this.lastNameInput = page.locator('input[formcontrolname="lastName"]').first();
    this.emailInput = page.locator('input[formcontrolname="email"]').first();
    this.phoneInput = page.locator('input[formcontrolname="phone"]').first();
    this.genderDropdown = page.locator('p-select[formcontrolname="gender"]');
    this.dobDatePicker = page.locator('p-datepicker[formcontrolname="DOB"] input').first();
    this.categoryDropdown = page.locator('p-select[formcontrolname="category"]');

    // Step 2
    this.admissionDateDatePicker = page.locator('p-datepicker[formcontrolname="dateOfJoining"] input');
    this.classDropdown = page.locator('p-select[formcontrolname="classId"]');
    this.sectionDropdown = page.locator('p-select[formcontrolname="sectionId"]');
    this.admissionTypeDropdown = page.locator('p-select[formcontrolname="admissionType"]');

    // Step 3
    this.countryDropdown = page.locator('p-select[formcontrolname="country"]');
    // NOTE: exact formcontrolname for the State dropdown was not visible in the
    // captured HTML (only its placeholder/filter were shown). Adjust if different.
    this.stateDropdown = page.locator('p-select[formcontrolname="state"]');
    this.cityDropdown = page.locator('p-select[formcontrolname="city"]');
    this.pinCodeInput = page.locator('input[formcontrolname="pinCode"]');
    this.addressLine1 = page.locator('textarea[formcontrolname="addressline1"]');
    this.addressLine2 = page.locator('textarea[formcontrolname="addressline2"]');

    // Step 4 (use .last() to always target the guardian's copy of shared fields)
    this.relationTypeDropdown = page.locator('p-select[formcontrolname="relationType"]');
    this.guardianFirstNameInput = page.locator('input[formcontrolname="firstName"]').last();
    this.guardianLastNameInput = page.locator('input[formcontrolname="lastName"]').last();
    this.guardianDobDatePicker = page.locator('p-datepicker[formcontrolname="DOB"] input').last();
    this.guardianPhoneInput = page.locator('input[formcontrolname="phone"]').last();
    this.guardianEmailInput = page.locator('input[formcontrolname="email"]').last();
    this.docTypeDropdown = page.locator('p-select[formcontrolname="docType"]');
    this.docNumberInput = page.locator('input[formcontrolname="docNumber"]');
  }

  // ---------------- Navigation ----------------
  async openAddStudentForm() {
    await this.studentNavLink.click();
    await this.openAddStudentButton.click();
  }

  // ---------------- Generic PrimeNG p-select helper ----------------
  private async selectDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.getByRole('combobox');

    while (Date.now() < deadline) {
      try {
        if (await combobox.getAttribute('aria-expanded') !== 'true') {
          await combobox.click({ timeout: 1000 });
        }
        const listboxId = await combobox.getAttribute('aria-controls');
        const activeListbox = listboxId
          ? this.page.locator(`#${listboxId}`)
          : this.page.locator('ul[role="listbox"]:visible').last();
        await activeListbox.waitFor({ state: 'visible', timeout: 1000 });
        const option = activeListbox.getByRole('option', { name: optionText, exact: true });
        await option.first().waitFor({ state: 'visible', timeout: 1000 });
        await option.first().scrollIntoViewIfNeeded();
        await option.first().click();
        return;
      } catch {
        if (!this.page.isClosed()) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(250);
        }
      }
    }

    throw new Error(`Timed out waiting for ${optionText} in the dropdown`);
  }

  /** For filterable p-select (country / state / city) which have a search box */
  private async selectFilterableDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.getByRole('combobox');

    while (Date.now() < deadline) {
      try {
        if (await combobox.getAttribute('aria-expanded') !== 'true') {
          await combobox.click({ timeout: 1000 });
        }
        const listboxId = await combobox.getAttribute('aria-controls');
        const activeListbox = listboxId
          ? this.page.locator(`#${listboxId}`)
          : this.page.locator('ul[role="listbox"]:visible').last();
        await activeListbox.waitFor({ state: 'visible', timeout: 1000 });

        const filterInput = activeListbox.locator('xpath=preceding::input[contains(@class, "p-select-filter")]').last();
        await filterInput.waitFor({ state: 'visible', timeout: 1000 });
        await filterInput.fill(optionText);

        const option = activeListbox.getByRole('option', { name: optionText, exact: true });
        await option.first().waitFor({ state: 'visible', timeout: 1000 });
        await option.first().scrollIntoViewIfNeeded();
        await option.first().click();
        return;
      } catch {
        if (!this.page.isClosed()) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(250);
        }
      }
    }

    throw new Error(`Timed out waiting for ${optionText} in the dropdown`);
  }

  // ---------------- Generic PrimeNG p-datepicker helper ----------------
  private async navigateDecadeUntilYearVisible(targetYear: number, maxAttempts = 14) {
    for (let i = 0; i < maxAttempts; i++) {
      const yearLocators = this.page.locator('span.p-datepicker-year:visible');
      const years = (await yearLocators.allTextContents())
        .map((y) => parseInt(y.trim(), 10))
        .filter((n) => !isNaN(n));
      if (years.includes(targetYear)) return;
      if (years.length === 0) break;

      const min = Math.min(...years);
      const max = Math.max(...years);
      if (targetYear < min) {
        const previousButton = this.page.getByRole('button', { name: 'Previous Decade' });
        await previousButton.waitFor({ state: 'visible', timeout: 1000 });
        await previousButton.click({ timeout: 3000 });
        await this.waitForDecadeChange();
      } else if (targetYear > max) {
        const nextButton = this.page.getByRole('button', { name: 'Next Decade' });
        await nextButton.waitFor({ state: 'visible', timeout: 1000 });
        await nextButton.click({ timeout: 3000 });
        await this.waitForDecadeChange();
      } else {
        return;
      }
    }
  }

  private async waitForDecadeChange() {
    await this.page.waitForTimeout(500);
  }

  /**
   * Selects year + month + day on a PrimeNG p-datepicker.
   * Month is 0-indexed (0 = Jan). Day defaults to 15 (safe for every month).
   */
  private async selectDateByYear(input: Locator, year: number, monthIndex = 0, day = 15) {
    await input.click();
    await this.page.getByRole('button', { name: 'Choose Year' }).click();
    await this.navigateDecadeUntilYearVisible(year);
    await this.page.locator('span.p-datepicker-year:visible', { hasText: String(year) }).click();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    await this.page.locator('span.p-datepicker-month:visible', { hasText: monthNames[monthIndex] }).click();

    await this.page.locator(`span[data-date="${year}-${monthIndex}-${day}"]:visible`).click();
  }

  /** Selects today's date using the data-date attribute PrimeNG renders on each day cell */
  private async selectToday(input: Locator) {
    await input.click();
    const today = new Date();
    const dateAttr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    await this.page.locator(`span[data-date="${dateAttr}"]:visible`).click();
  }

  // ---------------- File upload helper ----------------
  /** Uploads the same file to every file input currently rendered (as requested) */
  private async uploadToAllFileInputs(filePath: string) {
    const fileInputs = this.page.locator('input.file-upload-input, input[type="file"]');
    const count = await fileInputs.count();
    for (let i = 0; i < count; i++) {
      await fileInputs.nth(i).setInputFiles(filePath);
    }
  }

  // ---------------- Step 1 ----------------
  async fillStudentDetails(details: StudentDetails, photoPath: string) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.selectDropdownOption(this.genderDropdown, details.gender);
    await this.selectDateByYear(this.dobDatePicker, details.dobYear);
    await this.selectDropdownOption(this.categoryDropdown, details.category);
    await this.uploadToAllFileInputs(photoPath);
    await this.nextButton.click();
  }

  // ---------------- Step 2 ----------------
  async fillAcademicDetails(details: AcademicDetails) {
    await this.selectToday(this.admissionDateDatePicker);
    await this.selectDropdownOption(this.classDropdown, details.className);
    await this.selectDropdownOption(this.sectionDropdown, details.section);
    await this.selectDropdownOption(this.admissionTypeDropdown, details.admissionType);
    await this.nextButton.click();
  }

  // ---------------- Step 3 ----------------
  async fillAddressDetails(details: AddressDetails) {
    await this.selectFilterableDropdownOption(this.countryDropdown, details.country);
    await this.selectFilterableDropdownOption(this.stateDropdown, details.state);
    await this.selectFilterableDropdownOption(this.cityDropdown, details.city);
    await this.pinCodeInput.fill(details.pinCode);
    await this.addressLine1.fill(details.addressLine1);
    await this.addressLine2.fill(details.addressLine2);
    await this.nextButton.click();
  }

  // ---------------- Step 4 ----------------
  async fillGuardianDetails(details: GuardianDetails, docPath: string) {
    await this.selectDropdownOption(this.relationTypeDropdown, details.relationType);
    await this.guardianFirstNameInput.fill(details.firstName);
    await this.guardianLastNameInput.fill(details.lastName);
    await this.selectDateByYear(this.guardianDobDatePicker, details.dobYear);
    await this.guardianPhoneInput.fill(details.phone);
    await this.guardianPhoneInput.press('Tab');
    await this.guardianEmailInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.guardianEmailInput.fill(details.email);
    await this.guardianEmailInput.press('Tab');
    if (await this.guardianEmailInput.inputValue() !== details.email) {
      await this.guardianEmailInput.fill(details.email);
      await this.guardianEmailInput.press('Tab');
    }
    await this.selectDropdownOption(this.docTypeDropdown, details.docType);
    await this.docNumberInput.fill(details.docNumber);
    await this.uploadToAllFileInputs(docPath);
    await this.reviewAddStudentButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.reviewAddStudentButton.scrollIntoViewIfNeeded();
    await this.reviewAddStudentButton.click({ timeout: 30000 });
    await this.submitButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click({ timeout: 30000 });
  }
}