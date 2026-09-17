import { Page, Locator, expect } from '@playwright/test';

export interface EmployeeDetails {
  // Step 1: Personal Details
  firstName: string;
  lastName: string;
  email: string;
  gender: string;               // 'Male' | 'Female'
  dobYear: number;              // e.g. 1992
  phone: string;                // 10-digit unique number
  category?: string;            // 'SC' | 'GENERAL' | 'OBC'
  bloodGroup?: string;          // 'B+' | 'O+' | 'A+' | 'B-'
  verificationDocType?: string; // 'Aadhaar card' | 'PAN Card'
  verificationDocNumber: string;// 12-digit unique number
  emergencyContactName: string;
  emergencyContactNumber: string;
  hasHealthIssue?: 'yes' | 'no';
  healthIssueDetails?: string;

  // Step 2: Job & Salary / Bank Details
  role?: string;                // 'Admin' | 'Teaching-Assistant' | 'Accountant' | 'IT Technician'
  dateOfJoining?: Date;
  employementType?: string;     // 'Full-time' | 'Part-time' | 'Contract'
  salaryType?: string;          // 'Monthly'
  basicSalary?: number;         // e.g. 45000
  effectiveFrom?: Date;
  ifsc?: string;                // Default: 'CITI0000032'
  accountNumber?: string;
  confirmAccountNumber?: string;
  accountHolderName?: string;

  // Step 3: Address Details
  typeOfAddress?: string;       // 'Permanent' | 'Temporary'
  country?: string;             // 'India'
  state?: string;               // 'Delhi'
  city?: string;                // 'Delhi'
  pinCode?: string;             // '110001'
  addressLine1?: string;
  addressLine2?: string;

  // Step 4: Profile Image
  profileImagePath?: string;
  aadhaarFrontPath?: string;
  aadhaarBackPath?: string;
}

export class AddEmployeePage {
  readonly page: Page;

  // 1 & 2: Navigation & Add Employee Button
  readonly manageNavLink: Locator;
  readonly employeeModuleCard: Locator;
  readonly openAddEmployeeButton: Locator;

  // Step 1: Personal Details (Items 3 - 20)
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly genderDropdown: Locator;
  readonly dobDatePickerInput: Locator;
  readonly phoneInput: Locator;
  readonly categoryDropdown: Locator;
  readonly bloodGroupDropdown: Locator;
  readonly verificationDocTypeDropdown: Locator;
  readonly verificationDocNumberInput: Locator;
  readonly emergencyContactNameInput: Locator;
  readonly emergencyContactNumberInput: Locator;
  readonly hasHealthIssueYesRadio: Locator;
  readonly hasHealthIssueNoRadio: Locator;
  readonly healthIssueDetailsTextarea: Locator;
  readonly nextButtonStep1: Locator;

  private static escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async clickNextButton(locator: Locator) {
    const currentNextButton = this.page
      .locator('button.add-btn:visible')
      .filter({ hasText: /^\s*Next\s*$/i })
      .last();

    await currentNextButton.waitFor({ state: 'visible', timeout: 30000 });
    await currentNextButton.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await currentNextButton.click({ force: true, timeout: 10000 });
        await this.page.waitForTimeout(700);
        const validationErrors = this.page.locator('.ValidationErrMsg:visible');
        if (await validationErrors.count()) {
          throw new Error('The current employee step is incomplete; Next was not allowed to continue.');
        }
        return;
      } catch {
        if (await this.page.locator('.ValidationErrMsg:visible').count()) {
          throw new Error('The current employee step is incomplete; Next was not allowed to continue.');
        }
        await currentNextButton.evaluate((element: HTMLButtonElement) => element.click());
        await this.page.waitForTimeout(700);
      }
    }

    throw new Error('Next button could not be clicked after retries.');
  }

  // Step 2: Job & Salary / Bank Details (Items 21 - 35)
  readonly roleDropdown: Locator;
  readonly dateOfJoiningDatePickerInput: Locator;
  readonly employementTypeDropdown: Locator;
  readonly salaryTypeDropdown: Locator;
  readonly basicSalaryInput: Locator;
  readonly effectiveFromDatePickerInput: Locator;
  readonly ifscInput: Locator;
  readonly bankNameInput: Locator;
  readonly accountNumberInput: Locator;
  readonly confirmAccountNumberInput: Locator;
  readonly accountHolderNameInput: Locator;
  readonly nextButtonStep2: Locator;

  // Step 3: Address Details (Items 36 - 44)
  readonly typeOfAddressDropdown: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly pinCodeInput: Locator;
  readonly addressLine1Textarea: Locator;
  readonly addressLine2Textarea: Locator;
  readonly nextButtonStep3: Locator;

  // Step 4: Upload & Submit (Items 45 - 46)
  readonly profileImageFileInput: Locator;
  readonly submitAddEmployeeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 1 & 2. Navigation
    this.manageNavLink = page
      .locator('a[routerlink="/school-management"], a:has-text("Manage")')
      .first();
    this.employeeModuleCard = page
      .locator('div.card:has(h3:text-is("Employee")), h3:text-is("Employee")')
      .first();
    this.openAddEmployeeButton = page
      .locator('button.add-btn:has-text("Add employee"), button[routerlink*="employee/add"]')
      .first();

    // Step 1: Personal Details
    this.firstNameInput = page.locator('input#firstName, input[formcontrolname="firstName"]');
    this.lastNameInput = page.locator('input#lastName, input[formcontrolname="lastName"]');
    this.emailInput = page.locator('input#email, input[formcontrolname="email"]');
    this.genderDropdown = page.locator('p-select[formcontrolname="gender"]');
    this.dobDatePickerInput = page.locator('p-datepicker[formcontrolname="DOB"] input');
    this.phoneInput = page.locator('input[formcontrolname="phone"]');
    this.categoryDropdown = page.locator('p-select[formcontrolname="category"]');
    this.bloodGroupDropdown = page.locator('p-select[formcontrolname="bloodGroup"]');
    this.verificationDocTypeDropdown = page.locator('p-select[formcontrolname="verificationDocType"]');
    this.verificationDocNumberInput = page.locator('input#verificationDocNumber, input[formcontrolname="verificationDocNumber"]');
    this.emergencyContactNameInput = page.locator('input#emergencyContactName, input[formcontrolname="emergencyContactName"]');
    this.emergencyContactNumberInput = page.locator('input#EmergencyContactNumber, input[formcontrolname="EmergencyContactNumber"]');
    this.hasHealthIssueYesRadio = page.locator('input#hasHealthIssueYes, input[value="yes"][formcontrolname="hasHealthIssue"]');
    this.hasHealthIssueNoRadio = page.locator('input#hasHealthIssueNo, input[value="no"][formcontrolname="hasHealthIssue"]');
    this.healthIssueDetailsTextarea = page.locator('textarea[formcontrolname="healthIssueDetails"]');
    this.nextButtonStep1 = page.locator('button.add-btn:visible').filter({ hasText: /^\s*Next\s*$/i }).last();

    // Step 2: Job & Salary / Bank Details
    this.roleDropdown = page.locator('p-select[formcontrolname="role"]');
    this.dateOfJoiningDatePickerInput = page.locator('p-datepicker[formcontrolname="dateOfJoining"] input');
    this.employementTypeDropdown = page.locator('p-select[formcontrolname="employementType"]');
    this.salaryTypeDropdown = page.locator('p-select[formcontrolname="salaryType"]');
    this.basicSalaryInput = page.locator('input#basicSalary, input[formcontrolname="basicSalary"]');
    this.effectiveFromDatePickerInput = page.locator('p-datepicker[formcontrolname="effectiveFrom"] input');
    this.ifscInput = page.locator('input#ifsc, input[formcontrolname="ifsc"]');
    this.bankNameInput = page.locator('input#bankName, input[formcontrolname="bankName"]');
    this.accountNumberInput = page.locator('input#accountNumber, input[formcontrolname="accountNumber"]');
    this.confirmAccountNumberInput = page.locator('input#confirmAccountNumber, input[formcontrolname="confirmAccountNumber"]');
    this.accountHolderNameInput = page.locator('input#accountHolderName, input[formcontrolname="accountHolderName"]');
    this.nextButtonStep2 = page.locator('button.add-btn:visible').filter({ hasText: /^\s*Next\s*$/i }).last();

    // Step 3: Address Details
    this.typeOfAddressDropdown = page.locator('p-select[formcontrolname="typeOfAddress"]');
    this.countryDropdown = page.locator('p-select[formcontrolname="country"]');
    this.stateDropdown = page.locator('p-select[formcontrolname="state"]');
    this.cityDropdown = page.locator('p-select[formcontrolname="city"]');
    this.pinCodeInput = page.locator('input#pinCode, input[formcontrolname="pinCode"]');
    this.addressLine1Textarea = page.locator('textarea#addressLine1, textarea[formcontrolname="addressLine1"]');
    this.addressLine2Textarea = page.locator('textarea#addressLine2, textarea[formcontrolname="addressLine2"]');
    this.nextButtonStep3 = page.locator('button.add-btn:visible').filter({ hasText: /^\s*Next\s*$/i }).last();

    // Step 4: Documents & Final Submit
    this.profileImageFileInput = page.locator('input.file-upload-input, input[type="file"]').first();
    this.submitAddEmployeeButton = page.getByRole('button', { name: 'Confirm & Add', exact: true });
  }

  // ---------------- Navigation ----------------

  async navigateToEmployeeModule() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.employeeModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.employeeModuleCard.click();
    await this.page.waitForTimeout(500);
  }

  async clickAddEmployee() {
    await this.openAddEmployeeButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.openAddEmployeeButton.click();
    await this.page.waitForTimeout(500);
  }

  // ---------------- Dropdown & Date Helpers ----------------

  async selectDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    const exactPattern = new RegExp(`^\\s*${AddEmployeePage.escapeRegExp(optionText)}\\s*$`, 'i');
    const partialPattern = new RegExp(`^\\s*${AddEmployeePage.escapeRegExp(optionText)}\\b`, 'i');

    while (Date.now() < deadline) {
      try {
        await combobox.scrollIntoViewIfNeeded();
        await combobox.click({ timeout: 1500 });
        await this.page.waitForTimeout(250);

        const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
        await listbox.waitFor({ state: 'visible', timeout: 2000 });

        const option = listbox
          .locator('li[role="option"], p-selectitem')
          .filter({ hasText: exactPattern })
          .first();

        if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
          await option.click();
          return;
        }

        const partialOption = listbox.locator('li[role="option"], p-selectitem').filter({ hasText: partialPattern }).first();
        if (await partialOption.isVisible({ timeout: 1500 }).catch(() => false)) {
          await partialOption.click();
          return;
        }

        const firstOption = listbox.locator('li[role="option"]').first();
        if (await firstOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await firstOption.click();
          return;
        }
      } catch {
        if (!this.page.isClosed()) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(200);
        }
      }
    }
  }

  async selectFilterableDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    const exactPattern = new RegExp(`^\\s*${AddEmployeePage.escapeRegExp(optionText)}\\s*$`, 'i');

    while (Date.now() < deadline) {
      try {
        await combobox.scrollIntoViewIfNeeded();
        await combobox.click({ timeout: 1500 });
        await this.page.waitForTimeout(250);

        const filterInput = this.page.locator('input.p-select-filter:visible, input[role="searchbox"]:visible').first();
        if (await filterInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await filterInput.fill('');
          await filterInput.fill(optionText);
          await this.page.waitForTimeout(300);
        }

        const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
        await listbox.waitFor({ state: 'visible', timeout: 2000 });

        const exactOption = listbox
          .locator('li[role="option"], p-selectitem')
          .filter({ hasText: exactPattern })
          .first();

        if (await exactOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await exactOption.click();
          return;
        }

        const visibleOptions = listbox.locator('li[role="option"], p-selectitem');
        const total = await visibleOptions.count();
        for (let index = 0; index < total; index++) {
          const option = visibleOptions.nth(index);
          const label = (await option.textContent()) || '';
          if (new RegExp(`^\\s*${AddEmployeePage.escapeRegExp(optionText)}\\s*$`, 'i').test(label)) {
            await option.click();
            return;
          }
        }
      } catch {
        if (!this.page.isClosed()) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(200);
        }
      }
    }

    throw new Error(`Could not find option "${optionText}" in dropdown`);
  }

  private async selectSecondIndiaOption(timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = this.countryDropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();

    while (Date.now() < deadline) {
      try {
        await combobox.scrollIntoViewIfNeeded();
        await combobox.click({ timeout: 1500 });
        await this.page.waitForTimeout(250);

        const filterInput = this.page.locator('input.p-select-filter:visible, input[role="searchbox"]:visible').first();
        if (await filterInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await filterInput.fill('India');
          await this.page.waitForTimeout(300);
        }

        const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
        await listbox.waitFor({ state: 'visible', timeout: 2000 });
        const indiaOptions = listbox.locator('li[role="option"], p-selectitem').filter({ hasText: /^\s*India\s*$/i });
        const count = await indiaOptions.count();
        const target = indiaOptions.nth(count > 1 ? 1 : 0);

        if (count > 0 && await target.isVisible({ timeout: 2000 }).catch(() => false)) {
          await target.click();
          await expect(combobox).toHaveAttribute('aria-label', 'India', { timeout: 3000 });
          return;
        }
      } catch {
        if (!this.page.isClosed()) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(250);
        }
      }
    }

    throw new Error('Could not select India from the country dropdown.');
  }

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
        await previousButton.waitFor({ state: 'visible', timeout: 1500 });
        await previousButton.click({ timeout: 3000 });
        await this.page.waitForTimeout(500);
      } else if (targetYear > max) {
        const nextButton = this.page.getByRole('button', { name: 'Next Decade' });
        await nextButton.waitFor({ state: 'visible', timeout: 1500 });
        await nextButton.click({ timeout: 3000 });
        await this.page.waitForTimeout(500);
      } else {
        return;
      }
    }
  }

  private async selectDateByYear(input: Locator, year: number, monthIndex = 4, day = 15) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await this.page.waitForTimeout(300);

    const chooseYearBtn = this.page.getByRole('button', { name: 'Choose Year' });
    if (await chooseYearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await chooseYearBtn.click();
      await this.page.waitForTimeout(300);
      await this.navigateDecadeUntilYearVisible(year);

      const yearSpan = this.page.locator('span.p-datepicker-year:visible', { hasText: String(year) }).first();
      if (await yearSpan.isVisible({ timeout: 1500 }).catch(() => false)) {
        await yearSpan.click();
        await this.page.waitForTimeout(300);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthSpan = this.page.locator('span.p-datepicker-month:visible', { hasText: monthNames[monthIndex] }).first();
        if (await monthSpan.isVisible({ timeout: 1500 }).catch(() => false)) {
          await monthSpan.click();
          await this.page.waitForTimeout(300);
        }

        const dateAttr = `${year}-${monthIndex}-${day}`;
        const dayCell = this.page.locator(`span[data-date="${dateAttr}"]:visible, .p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}"):visible`).first();
        if (await dayCell.isVisible({ timeout: 1500 }).catch(() => false)) {
          await dayCell.click();
          await this.page.waitForTimeout(200);
        }
      }
    }

    // Verify or fallback: ensure value has correct birth year (>= 18 years old)
    const currentVal = (await input.inputValue().catch(() => '')).trim();
    if (!currentVal || currentVal.endsWith('2026') || !currentVal.includes(String(year))) {
      const dd = String(day).padStart(2, '0');
      const mm = String(monthIndex + 1).padStart(2, '0');
      await input.fill('');
      await input.fill(`${dd}/${mm}/${year}`);
      await input.dispatchEvent('input');
      await input.dispatchEvent('change');
      await input.press('Tab');
      await this.page.keyboard.press('Escape');
    }
  }

  private async selectToday(input: Locator) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await this.page.waitForTimeout(300);

    const today = new Date();
    const todayCell = this.page.locator(
      '.p-datepicker-calendar td:not(.p-datepicker-other-month).p-datepicker-today, span[data-p-highlight="true"], td.p-datepicker-today span'
    ).first();

    if (await todayCell.isVisible({ timeout: 1500 }).catch(() => false)) {
      await todayCell.click();
    } else {
      const dayCell = this.page.locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${today.getDate()}"):visible`).first();
      if (await dayCell.isVisible({ timeout: 1500 }).catch(() => false)) {
        await dayCell.click();
      } else {
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        await input.fill(`${dd}/${mm}/${yyyy}`);
        await input.press('Enter');
        await this.page.keyboard.press('Escape');
      }
    }
    await this.page.waitForTimeout(200);
  }

  // ---------------- Wizard Step 1: Personal Details ----------------

  async fillPersonalDetails(details: EmployeeDetails) {
    // 3. First Name
    await this.firstNameInput.scrollIntoViewIfNeeded();
    await this.firstNameInput.fill(details.firstName);

    // 4. Last Name
    await this.lastNameInput.scrollIntoViewIfNeeded();
    await this.lastNameInput.fill(details.lastName);

    // 5. Email
    await this.emailInput.scrollIntoViewIfNeeded();
    await this.emailInput.fill(details.email);

    // 6 & 7. Gender
    await this.selectDropdownOption(this.genderDropdown, details.gender || 'Male');

    // 8. DOB
    await this.selectDateByYear(this.dobDatePickerInput, details.dobYear || 1992);

    // 9. Phone
    await this.phoneInput.scrollIntoViewIfNeeded();
    await this.phoneInput.fill(details.phone);

    // 10 & 11. Category
    if (details.category) {
      await this.selectDropdownOption(this.categoryDropdown, details.category);
    }

    // 12 & 13. Blood Group
    if (details.bloodGroup) {
      await this.selectDropdownOption(this.bloodGroupDropdown, details.bloodGroup);
    }

    // 14. Verification Document Type
    if (details.verificationDocType) {
      await this.selectFilterableDropdownOption(this.verificationDocTypeDropdown, details.verificationDocType);
    }

    // 15. Document Number
    await this.verificationDocNumberInput.scrollIntoViewIfNeeded();
    await this.verificationDocNumberInput.fill(details.verificationDocNumber);

    // 16. Emergency Contact Name
    await this.emergencyContactNameInput.scrollIntoViewIfNeeded();
    await this.emergencyContactNameInput.fill(details.emergencyContactName);

    // 17. Emergency Contact Number
    await this.emergencyContactNumberInput.scrollIntoViewIfNeeded();
    await this.emergencyContactNumberInput.fill(details.emergencyContactNumber);

    // 18 & 19. Health Issue
    if (details.hasHealthIssue === 'yes') {
      await this.hasHealthIssueYesRadio.check({ force: true });
      if (details.healthIssueDetails) {
        await this.healthIssueDetailsTextarea.fill(details.healthIssueDetails);
      }
    } else {
      if (await this.hasHealthIssueNoRadio.isVisible().catch(() => false)) {
        await this.hasHealthIssueNoRadio.check({ force: true });
      } else {
        await this.hasHealthIssueYesRadio.check({ force: true });
        await this.healthIssueDetailsTextarea.fill('None');
      }
    }

    // 20. Next button Step 1
    await this.clickNextButton(this.nextButtonStep1);
  }

  // ---------------- Wizard Step 2: Job, Salary & Bank Details ----------------

  async fillJobAndBankDetails(details: EmployeeDetails) {
    // 21 & 22. Role
    await this.selectFilterableDropdownOption(this.roleDropdown, details.role || 'Admin');

    // 23. Date of Joining
    await this.selectToday(this.dateOfJoiningDatePickerInput);

    // 24 & 25. Employment Type
    await this.selectDropdownOption(this.employementTypeDropdown, details.employementType || 'Full-time');

    // 26 & 27. Salary Type
    await this.selectDropdownOption(this.salaryTypeDropdown, details.salaryType || 'Monthly');

    // 28. Basic salary
    await this.basicSalaryInput.scrollIntoViewIfNeeded();
    await this.basicSalaryInput.fill(String(details.basicSalary || 45000));

    // 29. Effective From
    await this.selectToday(this.effectiveFromDatePickerInput);

    // 30. IFSC Code (CITI0000032)
    const ifscCode = details.ifsc || 'CITI0000032';
    await this.ifscInput.scrollIntoViewIfNeeded();
    await this.ifscInput.fill(ifscCode);
    await this.ifscInput.press('Tab');
    await this.page.waitForTimeout(1000);

    // 31. Bank Name: check if auto-fetched, fallback to 'CITI bank'
    const fetchedBankName = (await this.bankNameInput.inputValue().catch(() => '')).trim();
    if (!fetchedBankName) {
      await this.bankNameInput.evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = 'CITI bank';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
      });
    }

    // 32. Account Number
    const accountNum = details.accountNumber || `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    await this.accountNumberInput.scrollIntoViewIfNeeded();
    await this.accountNumberInput.fill(accountNum);

    // 33. Confirm Account Number
    await this.confirmAccountNumberInput.scrollIntoViewIfNeeded();
    await this.confirmAccountNumberInput.fill(accountNum);

    // 34. Account Holder Name
    const holderName = details.accountHolderName || `${details.firstName} ${details.lastName}`;
    await this.accountHolderNameInput.scrollIntoViewIfNeeded();
    await this.accountHolderNameInput.fill(holderName);

    // 35. Next button Step 2
    await this.clickNextButton(this.nextButtonStep2);
  }

  // ---------------- Wizard Step 3: Address Details ----------------

  async fillAddressDetails(details: EmployeeDetails) {
    // 36 & 37. Address Type
    await this.selectDropdownOption(this.typeOfAddressDropdown, details.typeOfAddress || 'Permanent');

    // 38. Country: select the second exact India option when duplicates are present.
    if ((details.country || 'India').toLowerCase() === 'india') {
      await this.selectSecondIndiaOption();
    } else {
      await this.selectFilterableDropdownOption(this.countryDropdown, details.country || 'India');
    }

    // 39. State
    await this.selectFilterableDropdownOption(this.stateDropdown, details.state || 'Delhi');

    // 40. City
    await this.selectFilterableDropdownOption(this.cityDropdown, details.city || 'Delhi');

    // 41. Pincode
    await this.pinCodeInput.scrollIntoViewIfNeeded();
    await this.pinCodeInput.fill(details.pinCode || '110001');

    // 42. Address Line 1
    await this.addressLine1Textarea.scrollIntoViewIfNeeded();
    await this.addressLine1Textarea.fill(details.addressLine1 || 'House No. 124, Sector 15');

    // 43. Address Line 2
    if (details.addressLine2) {
      await this.addressLine2Textarea.scrollIntoViewIfNeeded();
      await this.addressLine2Textarea.fill(details.addressLine2);
    }

    // 44. Next button Step 3
    await this.clickNextButton(this.nextButtonStep3);
  }

  // ---------------- Wizard Step 4: Documents & Submit ----------------

  async uploadProfileImageAndSubmit(
    profileImagePath?: string,
    aadhaarFrontPath?: string,
    aadhaarBackPath?: string,
  ) {
    const filePaths = [profileImagePath, aadhaarFrontPath, aadhaarBackPath];
    const uploadSection = this.page.locator('h5').filter({ hasText: /^Uploads$/i }).locator('..');
    const fileInputs = uploadSection.locator('input[type="file"], input.file-upload-input');
    const inputCount = await fileInputs.count();

    if (inputCount < filePaths.filter(Boolean).length) {
      throw new Error(`Expected ${filePaths.filter(Boolean).length} employee upload inputs, but found ${inputCount}.`);
    }

    for (let index = 0; index < filePaths.length; index++) {
      const filePath = filePaths[index];
      if (!filePath) continue;

      const fileInput = fileInputs.nth(index);
      await fileInput.waitFor({ state: 'attached', timeout: 15000 });
      await fileInput.setInputFiles(filePath);
      await this.page.waitForTimeout(500);

      const uploadedFileCount = await fileInput.evaluate((element: HTMLInputElement) => element.files?.length || 0);
      if (uploadedFileCount !== 1) {
        throw new Error(`Employee upload ${index + 1} did not receive a file.`);
      }
    }

    // 46. Confirm & Add
    await this.submitAddEmployeeButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.submitAddEmployeeButton.scrollIntoViewIfNeeded();
    await expect(this.submitAddEmployeeButton).toBeEnabled();

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.submitAddEmployeeButton.click({ force: true, timeout: 10000 });
        await this.page.waitForTimeout(1500);
        return;
      } catch {
        await this.submitAddEmployeeButton.evaluate((element: HTMLButtonElement) => element.click());
        await this.page.waitForTimeout(1000);
      }
    }

    throw new Error('Confirm & Add button could not be clicked after retries.');
  }

  /** Complete full 46-element sequential flow */
  async createEmployee(details: EmployeeDetails) {
    await this.navigateToEmployeeModule();
    await this.clickAddEmployee();
    await this.fillPersonalDetails(details);
    await this.fillJobAndBankDetails(details);
    await this.fillAddressDetails(details);
    await this.uploadProfileImageAndSubmit(
      details.profileImagePath,
      details.aadhaarFrontPath,
      details.aadhaarBackPath,
    );
  }
}
