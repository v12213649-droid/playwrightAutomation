import { Page, Locator } from '@playwright/test';

export interface UserAccountDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface SchoolBasicDetails {
  schoolName: string;
  schoolType?: string; // default: 'Private'
  mediumOfInstruction?: string; // default: 'English'
  registrationNumber: string;
  principalName: string;
  startTime?: string; // default: '08:00'
  endTime?: string; // default: '14:00'
  website?: string;
}

export interface SchoolContactDetails {
  email: string;
  phone: string;
}

export interface SchoolBoardDetails {
  board?: string; // default: 'CBSE'
  levels?: string[];
}

export interface AddressDetails {
  country: string; // 'India'
  state: string; // 'Delhi'
  city: string; // 'Delhi'
  pinCode: string; // e.g., '110001'
  address: string; // Address
}

export class AddSchoolPage {
  readonly page: Page;

  // 1. Navigation / Entry link
  readonly createAccountLink: Locator;

  // 2. Account registration elements (Items 2 - 8)
  readonly userFirstNameInput: Locator;
  readonly userLastNameInput: Locator;
  readonly userPhoneInput: Locator;
  readonly userEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountButton: Locator;

  // 3. OTP verification elements (Items 9 - 13)
  readonly otpInputs: Locator;
  readonly verifyOtpButton: Locator;

  // 4. School Details - Step 1 (Items 14 - 26)
  readonly schoolNameInput: Locator;
  readonly schoolTypeDropdown: Locator;
  readonly mediumDropdown: Locator;
  readonly registrationNumberInput: Locator;
  readonly establishedDatePickerInput: Locator;
  readonly principalNameInput: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly websiteInput: Locator;
  readonly fileUploadInput: Locator;
  readonly nextButtonStep1: Locator;

  // 5. School Contact - Step 2 (Items 27 - 29)
  readonly schoolEmailInput: Locator;
  readonly schoolPhoneInput: Locator;
  readonly nextButtonStep2: Locator;

  // 6. Board & Levels - Step 3 (Items 30 - 37)
  readonly boardsDropdown: Locator;
  readonly prePrimaryCheckbox: Locator;
  readonly primaryCheckbox: Locator;
  readonly secondaryCheckbox: Locator;
  readonly higherSecondaryCheckbox: Locator;
  readonly seniorSecondaryCheckbox: Locator;
  readonly nextButtonStep3: Locator;

  // 7. Address Details
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly pinCodeInput: Locator;
  readonly addressInput: Locator;
  readonly nextButtonAddress: Locator;
  readonly saveSchoolInfoButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 1. Create account entry link
    this.createAccountLink = page.locator(
      'a[routerlink="/auth/register"], a[href="/auth/register"], a:has-text("Create an account")',
    );

    // 2. User registration form
    this.userFirstNameInput = page.locator('input#firstName, input[formcontrolname="firstName"]').first();
    this.userLastNameInput = page.locator('input#lastName, input[formcontrolname="lastName"]').first();
    this.userPhoneInput = page.locator('input#phone, input[formcontrolname="phone"]').first();
    this.userEmailInput = page.locator('input#email, input[formcontrolname="email"]').first();
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.confirmPasswordInput = page.locator('input[formcontrolname="cpassword"]');
    this.createAccountButton = page.locator(
      'button.gradientBtn:has-text("Create Account"), button:has-text("Create Account")',
    );

    // 3. OTP
    this.otpInputs = page.locator('.p-inputotp-input');
    this.verifyOtpButton = page.locator('button:has-text("Verify"), button.gradientBtn:has-text("Verify")').first();

    // 4. School Details - Step 1
    this.schoolNameInput = page.locator('input#schoolName, input[formcontrolname="schoolName"]').first();
    this.schoolTypeDropdown = page.locator('p-select[formcontrolname="schoolType"]');
    this.mediumDropdown = page.locator('p-select[formcontrolname="mediumOfInstruction"]');
    this.registrationNumberInput = page.locator('input#registrationNumber, input[formcontrolname="regNumber"]');
    this.establishedDatePickerInput = page
      .locator(
        'p-datepicker[formcontrolname="establishedOn"] input, p-datepicker[formcontrolname="establishedOn"] button',
      )
      .first();
    this.principalNameInput = page.locator('input#principalName, input[formcontrolname="principleName"]');
    this.startTimeInput = page
      .locator(
        'input[placeholder*="08:00 AM"], input[placeholder*="08:00"], p-datepicker[formcontrolname="startTime"] input, input[formcontrolname="startTime"]',
      )
      .first();
    this.endTimeInput = page
      .locator(
        'input[placeholder*="02:30 PM"], input[placeholder*="02:30"], p-datepicker[formcontrolname="endTime"] input, input[formcontrolname="endTime"]',
      )
      .first();
    this.websiteInput = page.locator('input#website, input[formcontrolname="website"]');
    this.fileUploadInput = page.locator('input.file-upload-input, input[type="file"]').first();
    this.nextButtonStep1 = page.locator('button.gradientBtn:has-text("Next"), button:has-text("Next")').first();

    // 5. School Contact - Step 2
    this.schoolEmailInput = page.locator('input#emailAddress, input[formcontrolname="email"]').last();
    this.schoolPhoneInput = page.locator('input#phone, input[formcontrolname="phone"]').last();
    this.nextButtonStep2 = page.locator('button.gradientBtn:has-text("Next"), button:has-text("Next")').first();

    // 6. Board & Levels - Step 3
    this.boardsDropdown = page.locator('p-select[formcontrolname="boards"]');
    this.prePrimaryCheckbox = page.locator('input[type="checkbox"]#Pre-Primary, input#Pre-Primary');
    this.primaryCheckbox = page.locator('input[type="checkbox"]#Primary, input#Primary');
    this.secondaryCheckbox = page.locator('input[type="checkbox"]#Secondary, input#Secondary');
    this.higherSecondaryCheckbox = page.locator(
      'input[type="checkbox"][id="Higher Secondary"], [id="Higher Secondary"]',
    );
    this.seniorSecondaryCheckbox = page.locator(
      'input[type="checkbox"][id="Senior Secondary"], [id="Senior Secondary"]',
    );
    this.nextButtonStep3 = page.locator('button.gradientBtn:has-text("Next"), button:has-text("Next")').first();

    // 7. Address Details
    this.countryDropdown = page.locator('p-select[formcontrolname="country"]').first();
    this.stateDropdown = page.locator('p-select[formcontrolname="state"]').first();
    this.cityDropdown = page.locator('p-select[formcontrolname="city"]').first();
    this.pinCodeInput = page
      .locator(
        'input[formcontrolname="pinCode"], input[formcontrolname="pincode"], input[placeholder*="110001"], input#pinCode',
      )
      .first();
    this.addressInput = page
      .locator(
        'textarea#addressLine1, textarea[formcontrolname="line1"], textarea[placeholder*="Sector 12"], textarea[formcontrolname="addressline1"], textarea#address, input#addressLine1',
      )
      .first();
    this.saveSchoolInfoButton = page
      .locator(
        'button.gradientBtn:has-text("Save School Information"), button:has-text("Save School Information")',
      )
      .first();
    this.nextButtonAddress = this.saveSchoolInfoButton;
  }

  // ---------------- Navigation ----------------
  async gotoLogin() {
    await this.page.goto('https://app.thenexra.com/auth/login');
  }

  async clickCreateAccount() {
    await this.createAccountLink.waitFor({ state: 'visible', timeout: 30000 });
    await this.createAccountLink.scrollIntoViewIfNeeded();
    await this.createAccountLink.click();
  }

  // ---------------- Generic PrimeNG p-select helper ----------------
  async selectDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.getByRole('combobox');

    while (Date.now() < deadline) {
      try {
        if ((await combobox.getAttribute('aria-expanded')) !== 'true') {
          await combobox.click({ timeout: 1500 });
        }
        const listboxId = await combobox.getAttribute('aria-controls');
        const activeListbox = listboxId
          ? this.page.locator(`#${listboxId}`)
          : this.page.locator('ul[role="listbox"]:visible').last();
        await activeListbox.waitFor({ state: 'visible', timeout: 2000 });
        const option = activeListbox.getByRole('option', { name: optionText, exact: true });
        await option.first().waitFor({ state: 'visible', timeout: 2000 });
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

  // ---------------- For filterable p-select (country / state / city) ----------------
  async selectFilterableDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    await dropdown.scrollIntoViewIfNeeded();
    const combobox = dropdown.getByRole('combobox');

    while (Date.now() < deadline) {
      try {
        if ((await combobox.getAttribute('aria-expanded')) !== 'true') {
          await combobox.click({ timeout: 1500 });
        }
        const listboxId = await combobox.getAttribute('aria-controls');
        const activeListbox = listboxId
          ? this.page.locator(`#${listboxId}`)
          : this.page.locator('ul[role="listbox"]:visible').last();
        await activeListbox.waitFor({ state: 'visible', timeout: 2000 });

        const filterInput = activeListbox.locator('xpath=preceding::input[contains(@class, "p-select-filter")]').last();
        if (await filterInput.isVisible({ timeout: 1500 }).catch(() => false)) {
          await filterInput.fill(optionText);
          await this.page.waitForTimeout(300);
        }

        const option = activeListbox.getByRole('option', { name: optionText, exact: true });
        if (await option.first().isVisible({ timeout: 1500 }).catch(() => false)) {
          await option.first().scrollIntoViewIfNeeded();
          await option.first().click();
          return;
        }

        const optionByText = activeListbox.locator(`li[role="option"]:has-text("${optionText}")`).first();
        await optionByText.waitFor({ state: 'visible', timeout: 2000 });
        await optionByText.scrollIntoViewIfNeeded();
        await optionByText.click();
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

  // ---------------- Helper to select today's date in PrimeNG datepicker ----------------
  async selectEstablishedDateToday() {
    await this.establishedDatePickerInput.scrollIntoViewIfNeeded();
    await this.establishedDatePickerInput.click();
    await this.page.waitForTimeout(400);

    const today = new Date();
    const dateAttr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const dateSpan = this.page.locator(`span[data-date="${dateAttr}"]:visible`).first();
    if (await dateSpan.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dateSpan.click();
      return;
    }

    // Fallback: today's cell or day number
    const todayCell = this.page.locator(
      '.p-datepicker-calendar td:not(.p-datepicker-other-month).p-datepicker-today, span[data-p-highlight="true"]',
    );
    if (await todayCell.first().isVisible({ timeout: 1500 }).catch(() => false)) {
      await todayCell.first().click();
      return;
    }

    await this.page
      .locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${today.getDate()}"):visible`)
      .first()
      .click();
  }

  // ---------------- Helper to fill time inputs ----------------
  private async fillTimeInput(input: Locator, timeValue: string) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await this.page.waitForTimeout(200);

    // Clear and fill the exact timeValue (e.g. '08:00' or '14:00')
    await input.fill('');
    await input.fill(timeValue);
    await input.dispatchEvent('input');
    await input.dispatchEvent('change');
    await input.press('Tab');
    await this.page.waitForTimeout(200);

    // Safely close time overlay by clicking outside
    await this.page.locator('body').click({ position: { x: 0, y: 0 } }).catch(() => { });
    await this.page.waitForTimeout(200);
  }

  // ---------------- Step 1: User Registration ----------------
  async fillAccountRegistration(details: UserAccountDetails) {
    const password = details.password || 'Admin@12345';
    const confirmPassword = details.confirmPassword || password;

    await this.userFirstNameInput.scrollIntoViewIfNeeded();
    await this.userFirstNameInput.fill(details.firstName);
    await this.userLastNameInput.fill(details.lastName);
    await this.userPhoneInput.fill(details.phone);
    await this.userEmailInput.fill(details.email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);

    await this.createAccountButton.scrollIntoViewIfNeeded();
    await this.createAccountButton.click();
  }

  // ---------------- Step 2: OTP Verification ----------------
  async enterOtpAndVerify(otp = '1234') {
    const otpInputLocators = this.page.locator('.p-inputotp-input');
    await otpInputLocators.first().waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(500);

    // Type using real keystrokes to ensure Angular PrimeNG events fire
    await otpInputLocators.first().click();
    await this.page.keyboard.type(otp, { delay: 150 });

    // Fallback if individual boxes are empty
    const count = await otpInputLocators.count();
    for (let i = 0; i < count; i++) {
      const val = await otpInputLocators.nth(i).inputValue().catch(() => '');
      if (!val && otp[i]) {
        await otpInputLocators.nth(i).click();
        await otpInputLocators.nth(i).fill(otp[i]);
      }
    }

    await this.page.waitForTimeout(400);

    // Safely attempt to click Verify button if visible
    try {
      const verifyBtn = this.page.locator('button:has-text("Verify"), button.gradientBtn:has-text("Verify")').first();
      const isVisible = await verifyBtn.isVisible({ timeout: 1500 }).catch(() => false);
      if (isVisible) {
        await verifyBtn.click({ timeout: 2000, force: true }).catch(() => { });
      }
    } catch {
      // Ignored: auto-verified and modal closed
    }

    // Wait for the next form page (schoolName input) to attach
    await this.schoolNameInput.waitFor({ state: 'attached', timeout: 30000 });
    await this.page.waitForTimeout(1000);

    // Stop any autofocus scroll jump and reset window scroll to top
    await this.page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await this.page.waitForTimeout(500);
  }

  // ---------------- Step 3: School Basic Details (Step 1) ----------------
  async fillSchoolBasicDetails(details: SchoolBasicDetails, logoPath: string) {
    // 14. School Name
    await this.schoolNameInput.scrollIntoViewIfNeeded();
    await this.schoolNameInput.click();
    await this.schoolNameInput.fill(details.schoolName);

    // 15-16. School Type (e.g. 'Private')
    await this.selectDropdownOption(this.schoolTypeDropdown, details.schoolType || 'Private');

    // 17-18. Medium of Instruction (e.g. 'English')
    await this.selectDropdownOption(this.mediumDropdown, details.mediumOfInstruction || 'English');

    // 19. Registration Number
    await this.registrationNumberInput.scrollIntoViewIfNeeded();
    await this.registrationNumberInput.fill(details.registrationNumber);

    // 20. Established On -> select current day
    await this.selectEstablishedDateToday();

    // 21. Principal Name
    await this.principalNameInput.scrollIntoViewIfNeeded();
    await this.principalNameInput.fill(details.principalName);

    // 22. Start time: exactly 08:00
    await this.fillTimeInput(this.startTimeInput, details.startTime || '08:00');

    // 23. End time: exactly 14:00
    await this.fillTimeInput(this.endTimeInput, details.endTime || '14:00');

    // 24. Website
    if (details.website) {
      await this.websiteInput.scrollIntoViewIfNeeded();
      await this.websiteInput.fill(details.website);
    }

    // 25. Upload random JPG image
    if (logoPath) {
      await this.fileUploadInput.setInputFiles(logoPath);
      await this.page.waitForTimeout(400);
    }

    // 26. Click Next
    await this.nextButtonStep1.scrollIntoViewIfNeeded();
    await this.nextButtonStep1.click();

    // Settle after transition
    await this.page.waitForTimeout(1000);
    await this.page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await this.page.waitForTimeout(300);
  }

  // ---------------- Step 4: School Contact Details (Step 2) ----------------
  async fillSchoolContactDetails(details: SchoolContactDetails) {
    // 27. School Email Address
    await this.schoolEmailInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.schoolEmailInput.scrollIntoViewIfNeeded();
    await this.schoolEmailInput.fill(details.email);

    // 28. School Phone Number
    await this.schoolPhoneInput.scrollIntoViewIfNeeded();
    await this.schoolPhoneInput.fill(details.phone);

    // 29. Click Next
    await this.nextButtonStep2.scrollIntoViewIfNeeded();
    await this.nextButtonStep2.click();

    // Settle after transition
    await this.page.waitForTimeout(1000);
    await this.page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await this.page.waitForTimeout(300);
  }

  // ---------------- Step 5: School Board & Levels (Step 3) ----------------
  async fillSchoolBoardAndLevels(
    details: SchoolBoardDetails = {
      board: 'CBSE',
      levels: ['Pre-Primary', 'Primary', 'Secondary', 'Higher Secondary', 'Senior Secondary'],
    },
  ) {
    // 30-31. Board Dropdown (e.g. 'CBSE')
    await this.boardsDropdown.waitFor({ state: 'visible', timeout: 30000 });
    await this.selectDropdownOption(this.boardsDropdown, details.board || 'CBSE');

    // 32-36. Checkboxes for school levels
    const levelsToSelect = details.levels || [
      'Pre-Primary',
      'Primary',
      'Secondary',
      'Higher Secondary',
      'Senior Secondary',
    ];

    const checkboxMap: Record<string, Locator> = {
      'Pre-Primary': this.prePrimaryCheckbox,
      'Primary': this.primaryCheckbox,
      'Secondary': this.secondaryCheckbox,
      'Higher Secondary': this.higherSecondaryCheckbox,
      'Senior Secondary': this.seniorSecondaryCheckbox,
    };

    for (const level of levelsToSelect) {
      const checkbox = checkboxMap[level];
      if (checkbox) {
        await checkbox.scrollIntoViewIfNeeded();
        const isChecked = await checkbox.isChecked().catch(() => false);
        if (!isChecked) {
          await checkbox.check({ force: true });
        }
      }
    }

    // 37 / Next button
    await this.nextButtonStep3.scrollIntoViewIfNeeded();
    await this.nextButtonStep3.click();
    await this.page.waitForTimeout(1000);
    await this.page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await this.page.waitForTimeout(300);
  }

  // ---------------- Step 6: Address Details ----------------
  async fillAddressDetails(details: AddressDetails) {
    // Country*
    await this.countryDropdown.waitFor({ state: 'visible', timeout: 30000 });
    await this.selectFilterableDropdownOption(this.countryDropdown, details.country);

    // State*
    await this.selectFilterableDropdownOption(this.stateDropdown, details.state);

    // City*
    await this.selectFilterableDropdownOption(this.cityDropdown, details.city);

    // Pin Code* (e.g. 110001)
    await this.pinCodeInput.scrollIntoViewIfNeeded();
    await this.pinCodeInput.fill(details.pinCode);

    // Address*
    await this.addressInput.scrollIntoViewIfNeeded();
    await this.addressInput.fill(details.address);

    // Submit / Next button
    await this.nextButtonAddress.scrollIntoViewIfNeeded();
    await this.nextButtonAddress.click();
    await this.page.waitForTimeout(1000);
  }
}
