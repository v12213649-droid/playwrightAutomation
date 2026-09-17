import { Page, Locator, expect } from '@playwright/test';

export interface TeacherBasicDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dobYear: number;
  verificationDocType: string;
  verificationDocNumber: string;
  hasHealthIssue?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  addressType?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  address?: string;
  contactName?: string;
  relationship?: string;
  emergencyPhoneNumber?: string;
}

export interface TeacherAddressDetails {
  typeOfAddress?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  addressline1?: string;
  contactName?: string;
  emergencyPhoneNumber?: string;
  relationship?: string;
}

export interface TeacherProfessionalDetails {
  relationship?: string;
  emergencyPhoneNumber?: string;
  employeeStatus?: string;
  employmentType?: string;
  acadmicQualification?: string;
  totalExperince?: number;
  dateOfJoining?: Date;
}

export interface TeacherBankDetails {
  ifsc: string;
  bankName: string;
  basicSalary?: number;
  accountNumber: string;
  confirmAccountNumber: string;
  accountHolderName: string;
  effectiveFrom?: Date;
}

export class AddTeacherPage {
  readonly page: Page;

  readonly teacherNavLink: Locator;
  readonly openAddTeacherButton: Locator;
  readonly nextButton: Locator;
  readonly addTeacherButton: Locator;
  readonly confirmAddButton: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly genderDropdown: Locator;
  readonly dobDatePicker: Locator;
  readonly verificationDocTypeDropdown: Locator;
  readonly verificationDocNumberInput: Locator;
  readonly hasHealthIssueDropdown: Locator;
  readonly maritalStatusDropdown: Locator;
  readonly bloodGroupDropdown: Locator;

  readonly typeOfAddressDropdown: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityDropdown: Locator;
  readonly pinCodeInput: Locator;
  readonly addressLine1Input: Locator;

  readonly contactNameInput: Locator;
  readonly profileImageInput: Locator;
  readonly aadhaarFrontInput: Locator;
  readonly aadhaarBackInput: Locator;
  readonly relationshipDropdown: Locator;
  readonly emergencyPhoneInput: Locator;
  readonly employeeStatusDropdown: Locator;
  readonly employmentTypeDropdown: Locator;
  readonly qualificationInput: Locator;
  readonly experienceInput: Locator;
  readonly dateOfJoiningDatePicker: Locator;

  readonly ifscInput: Locator;
  readonly bankNameInput: Locator;
  readonly basicSalaryInput: Locator;
  readonly accountNumberInput: Locator;
  readonly confirmAccountNumberInput: Locator;
  readonly accountHolderNameInput: Locator;
  readonly effectiveFromDatePicker: Locator;

  constructor(page: Page) {
    this.page = page;

    this.teacherNavLink = page.locator('a[routerlink="/teacher"]');
    this.openAddTeacherButton = page.locator('button.add-btn', { hasText: 'Add Teacher' });
    this.nextButton = page.getByRole('button', { name: 'Next', exact: true }).first();
    this.addTeacherButton = page.getByRole('button', { name: 'Add Teacher', exact: true }).last();
    this.confirmAddButton = page.getByRole('button', { name: 'Confirm & Add', exact: true });

    this.firstNameInput = page.locator('input[formcontrolname="firstName"]').first();
    this.lastNameInput = page.locator('input[formcontrolname="lastName"]').first();
    this.emailInput = page.locator('input[formcontrolname="email"]').first();
    this.phoneInput = page.locator('input[formcontrolname="phone"]').first();
    this.genderDropdown = page.locator('p-select[formcontrolname="gender"]');
    this.dobDatePicker = page.locator('p-datepicker[formcontrolname="DOB"] input').first();
    this.verificationDocTypeDropdown = page.locator('p-select[formcontrolname="verificationDocType"]');
    this.verificationDocNumberInput = page.locator('input[formcontrolname="verificationDocNumber"]').first();
    this.hasHealthIssueDropdown = page.locator('p-select[formcontrolname="hasHealthIssue"]');
    this.maritalStatusDropdown = page.locator('p-select[formcontrolname="maritalStatus"]');
    this.bloodGroupDropdown = page.locator('p-select[formcontrolname="bloodGroup"]');

    this.typeOfAddressDropdown = page.locator('p-select[formcontrolname="typeOfAddress"]');
    this.countryDropdown = page.locator('p-select[formcontrolname="country"]');
    this.stateDropdown = page.locator('p-select[formcontrolname="state"]');
    this.cityDropdown = page.locator('p-select[formcontrolname="city"]');
    this.pinCodeInput = page.locator('input[formcontrolname="pinCode"]').first();
    this.addressLine1Input = page.locator('input[formcontrolname="addressline1"], textarea[formcontrolname="addressline1"]').first();

    this.contactNameInput = page.locator('input[formcontrolname="emergencyContactName"]').first();
    this.profileImageInput = page.locator('input[type="file"]').nth(0);
    this.aadhaarFrontInput = page.locator('input[type="file"]').nth(1);
    this.aadhaarBackInput = page.locator('input[type="file"]').nth(2);
    this.relationshipDropdown = page.locator('p-select[formcontrolname="relationship"]');
    this.emergencyPhoneInput = page.locator('input[formcontrolname="emergencyPhoneNumber"]').first();
    this.employeeStatusDropdown = page.locator('p-select[formcontrolname="employeeStatus"]');
    this.employmentTypeDropdown = page.locator('p-select[formcontrolname="employmentType"]');
    this.qualificationInput = page.locator('input[formcontrolname="acadmicQualification"]').first();
    this.experienceInput = page.locator('input[formcontrolname="totalExperince"]').first();
    this.dateOfJoiningDatePicker = page.locator('p-datepicker[formcontrolname="dateOfJoining"] input').first();

    this.ifscInput = page.locator('input[formcontrolname="ifsc"]').first();
    this.bankNameInput = page.locator('input[formcontrolname="bankName"]').first();
    this.basicSalaryInput = page.locator('input[formcontrolname="basicSalary"]').first();
    this.accountNumberInput = page.locator('input[formcontrolname="accountNumber"]').first();
    this.confirmAccountNumberInput = page.locator('input[formcontrolname="confirmAccountNumber"]').first();
    this.accountHolderNameInput = page.locator('input[formcontrolname="accountHolderName"]').first();
    this.effectiveFromDatePicker = page.locator('p-datepicker[formcontrolname="effectiveFrom"] input').first();
  }

  async openAddTeacherForm() {
    await this.teacherNavLink.click();
    await this.openAddTeacherButton.click();
  }

  private async ensureVisible(locator: Locator, timeout = 15000) {
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor({ state: 'visible', timeout });
  }

  private async selectDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.getByRole('combobox');

    while (Date.now() < deadline) {
      try {
        await this.ensureVisible(combobox, 15000);
        if (await combobox.getAttribute('aria-expanded') !== 'true') {
          await combobox.click({ timeout: 1000 });
        }

        const listboxId = await combobox.getAttribute('aria-controls');
        const activeListbox = listboxId
          ? this.page.locator(`#${listboxId}`)
          : this.page.locator('ul[role="listbox"]:visible, div[role="listbox"]:visible').last();
        await activeListbox.waitFor({ state: 'visible', timeout: 1000 });

        const option = activeListbox.getByRole('option', { name: optionText, exact: true }).first();
        await option.waitFor({ state: 'visible', timeout: 1000 });
        await option.scrollIntoViewIfNeeded();
        await option.click();
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

  private async selectFilterableDropdownOption(dropdown: Locator, optionText: string, timeout = 30000) {
    const deadline = Date.now() + timeout;
    const combobox = dropdown.getByRole('combobox');

    while (Date.now() < deadline) {
      try {
        await this.ensureVisible(combobox, 15000);
        if (await combobox.getAttribute('aria-expanded') !== 'true') {
          await combobox.click({ timeout: 1000 });
        }

        const listboxId = await combobox.getAttribute('aria-controls');
        const activeListbox = listboxId
          ? this.page.locator(`#${listboxId}`)
          : this.page.locator('ul[role="listbox"]:visible, div[role="listbox"]:visible').last();
        await activeListbox.waitFor({ state: 'visible', timeout: 1000 });

        const filterInput = activeListbox.locator('xpath=preceding::input[contains(@class, "p-select-filter")]').last();
        if (await filterInput.count()) {
          await filterInput.waitFor({ state: 'visible', timeout: 1000 });
          await filterInput.fill(optionText);
        }

        const option = activeListbox.getByRole('option', { name: optionText, exact: true }).first();
        await option.waitFor({ state: 'visible', timeout: 1000 });
        await option.scrollIntoViewIfNeeded();
        await option.click();
        return;
      } catch {
        if (!this.page.isClosed()) {
          await this.page.keyboard.press('Escape');
          await this.page.waitForTimeout(250);
        }
      }
    }

    throw new Error(`Timed out waiting for ${optionText} in the filterable dropdown`);
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
        await previousButton.waitFor({ state: 'visible', timeout: 1000 });
        await previousButton.click({ timeout: 3000 });
        await this.page.waitForTimeout(500);
      } else if (targetYear > max) {
        const nextButton = this.page.getByRole('button', { name: 'Next Decade' });
        await nextButton.waitFor({ state: 'visible', timeout: 1000 });
        await nextButton.click({ timeout: 3000 });
        await this.page.waitForTimeout(500);
      } else {
        return;
      }
    }
  }

  private async selectDateByYear(input: Locator, year: number, monthIndex = 0, day = 15) {
    await input.click();
    await this.page.getByRole('button', { name: 'Choose Year' }).click();
    await this.navigateDecadeUntilYearVisible(year);
    await this.page.locator('span.p-datepicker-year:visible', { hasText: String(year) }).click();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    await this.page.locator('span.p-datepicker-month:visible', { hasText: monthNames[monthIndex] }).click();
    await this.page.locator(`span[data-date="${year}-${monthIndex}-${day}"]:visible`).click();
  }

  private async selectToday(input: Locator) {
    await input.click();
    const today = new Date();
    const dateAttr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    await this.page.locator(`span[data-date="${dateAttr}"]:visible`).click();
  }

  private async uploadRelevantTeacherFiles(filePath: string, labelText: string) {
    const uploadSection = this.page.locator('h5:has-text("Upload Documents")').locator('..');
    const uploadBox = uploadSection.locator('div', { hasText: labelText }).first();
    const input = uploadBox.locator('input[type="file"], input.file-upload-input').first();
    await input.waitFor({ state: 'attached', timeout: 15000 });
    await input.setInputFiles(filePath);
  }

  private async fillTextIfPresent(locator: Locator, value?: string) {
    if (!value) return;
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  private async uploadFileIfPresent(locator: Locator, filePath?: string) {
    if (!filePath) return;
    await locator.waitFor({ state: 'attached', timeout: 15000 });
    await locator.setInputFiles(filePath);
  }

  private async uploadTeacherDocuments(profileImagePath?: string, frontAadhaarPath?: string, backAadhaarPath?: string) {
    const uploadSection = this.page.locator('h5:has-text("Upload Documents")').locator('..');
    const fileInputs = uploadSection.locator('input[type="file"], input.file-upload-input');
    const count = await fileInputs.count();
    if (count === 0) return;

    const files = [profileImagePath, frontAadhaarPath, backAadhaarPath];

    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      if (!filePath) continue;

      const input = fileInputs.nth(i);
      await this.uploadFileIfPresent(input, filePath);
    }
  }

  async fillTeacherBasicDetails(
    details: TeacherBasicDetails,
    photoPath?: string,
    frontAadhaarPath?: string,
    backAadhaarPath?: string,
  ) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.selectDropdownOption(this.genderDropdown, details.gender);
    await this.selectDateByYear(this.dobDatePicker, details.dobYear);
    await this.selectDropdownOption(this.verificationDocTypeDropdown, details.verificationDocType);
    await this.verificationDocNumberInput.fill(details.verificationDocNumber);

    const hasHealthIssue = await this.hasHealthIssueDropdown.count();
    if (hasHealthIssue > 0 && details.hasHealthIssue) {
      await this.selectDropdownOption(this.hasHealthIssueDropdown, details.hasHealthIssue);
    }

    const hasMaritalStatus = await this.maritalStatusDropdown.count();
    if (hasMaritalStatus > 0 && details.maritalStatus) {
      await this.selectDropdownOption(this.maritalStatusDropdown, details.maritalStatus);
    }

    const hasBloodGroup = await this.bloodGroupDropdown.count();
    if (hasBloodGroup > 0 && details.bloodGroup) {
      await this.selectDropdownOption(this.bloodGroupDropdown, details.bloodGroup);
    }

    const hasTypeOfAddress = await this.typeOfAddressDropdown.count();
    if (hasTypeOfAddress > 0 && details.addressType) {
      await this.ensureVisible(this.typeOfAddressDropdown, 15000);
      await this.selectDropdownOption(this.typeOfAddressDropdown, details.addressType);
    }

    const hasCountry = await this.countryDropdown.count();
    if (hasCountry > 0 && details.country) {
      await this.ensureVisible(this.countryDropdown, 15000);
      await this.selectFilterableDropdownOption(this.countryDropdown, details.country);
    }

    const hasState = await this.stateDropdown.count();
    if (hasState > 0 && details.state) {
      await this.ensureVisible(this.stateDropdown, 15000);
      await this.selectFilterableDropdownOption(this.stateDropdown, details.state);
    }

    const hasCity = await this.cityDropdown.count();
    if (hasCity > 0 && details.city) {
      await this.ensureVisible(this.cityDropdown, 15000);
      await this.selectFilterableDropdownOption(this.cityDropdown, details.city);
    }

    const hasPinCode = await this.pinCodeInput.count();
    if (hasPinCode > 0 && details.pinCode) {
      await this.ensureVisible(this.pinCodeInput, 15000);
      await this.pinCodeInput.fill(details.pinCode);
    }

    const hasAddress = await this.addressLine1Input.count();
    if (hasAddress > 0 && details.address) {
      await this.ensureVisible(this.addressLine1Input, 15000);
      await this.addressLine1Input.fill(details.address);
    }

    const hasContactName = await this.contactNameInput.count();
    if (hasContactName > 0 && details.contactName) {
      await this.fillTextIfPresent(this.contactNameInput, details.contactName);
    }

    const hasRelationship = await this.relationshipDropdown.count();
    if (hasRelationship > 0 && details.relationship) {
      await this.ensureVisible(this.relationshipDropdown, 15000);
      await this.selectDropdownOption(this.relationshipDropdown, details.relationship);
    }

    if (details.emergencyPhoneNumber) {
      const hasEmergencyPhone = await this.emergencyPhoneInput.count();
      if (hasEmergencyPhone > 0) {
        await this.ensureVisible(this.emergencyPhoneInput, 15000);
        await this.emergencyPhoneInput.fill(details.emergencyPhoneNumber);
      }
    }

    if (photoPath || frontAadhaarPath || backAadhaarPath) {
      await this.uploadTeacherDocuments(photoPath, frontAadhaarPath, backAadhaarPath);
    }

    await this.nextButton.scrollIntoViewIfNeeded();
    await this.nextButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.nextButton.click({ timeout: 30000 });
  }

  async fillTeacherAddressDetails(details?: TeacherAddressDetails, photoPath?: string, frontAadhaarPath?: string, backAadhaarPath?: string) {
    if (!details) return;

    const hasTypeOfAddress = await this.typeOfAddressDropdown.count();
    if (hasTypeOfAddress > 0 && details.typeOfAddress) {
      await this.ensureVisible(this.typeOfAddressDropdown, 15000);
      await this.selectDropdownOption(this.typeOfAddressDropdown, details.typeOfAddress);
    }

    const hasCountry = await this.countryDropdown.count();
    if (hasCountry > 0 && details.country) {
      await this.ensureVisible(this.countryDropdown, 15000);
      await this.selectFilterableDropdownOption(this.countryDropdown, details.country);
    }

    const hasState = await this.stateDropdown.count();
    if (hasState > 0 && details.state) {
      await this.ensureVisible(this.stateDropdown, 15000);
      await this.selectFilterableDropdownOption(this.stateDropdown, details.state);
    }

    const hasCity = await this.cityDropdown.count();
    if (hasCity > 0 && details.city) {
      await this.ensureVisible(this.cityDropdown, 15000);
      await this.selectFilterableDropdownOption(this.cityDropdown, details.city);
    }

    const hasPinCode = await this.pinCodeInput.count();
    if (hasPinCode > 0 && details.pinCode) {
      await this.ensureVisible(this.pinCodeInput, 15000);
      await this.pinCodeInput.fill(details.pinCode);
    }

    const hasAddressLine1 = await this.addressLine1Input.count();
    if (hasAddressLine1 > 0 && details.addressline1) {
      await this.ensureVisible(this.addressLine1Input, 15000);
      await this.addressLine1Input.fill(details.addressline1);
    }

    const hasContactName = await this.contactNameInput.count();
    if (hasContactName > 0 && details.contactName) {
      await this.fillTextIfPresent(this.contactNameInput, details.contactName);
    }

    const hasRelationship = await this.relationshipDropdown.count();
    if (hasRelationship > 0 && details.relationship) {
      await this.ensureVisible(this.relationshipDropdown, 15000);
      await this.selectDropdownOption(this.relationshipDropdown, details.relationship);
    }

    if (details.emergencyPhoneNumber) {
      const hasEmergencyPhone = await this.emergencyPhoneInput.count();
      if (hasEmergencyPhone > 0) {
        await this.ensureVisible(this.emergencyPhoneInput, 15000);
        await this.emergencyPhoneInput.fill(details.emergencyPhoneNumber);
      }
    }

    if (photoPath || frontAadhaarPath || backAadhaarPath) {
      await this.uploadTeacherDocuments(photoPath, frontAadhaarPath, backAadhaarPath);
    }

    await this.nextButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.nextButton.scrollIntoViewIfNeeded();
    await this.nextButton.click({ timeout: 30000 });
  }

  async fillTeacherProfessionalDetails(
    details: TeacherProfessionalDetails,
    qualificationCertificatePath?: string,
    experienceCertificatePath?: string,
  ) {
    const hasRelationship = await this.relationshipDropdown.count();
    if (hasRelationship > 0) {
      await this.ensureVisible(this.relationshipDropdown, 15000);
      await this.selectDropdownOption(this.relationshipDropdown, details.relationship ?? 'Father');
    }

    if (details.emergencyPhoneNumber) {
      const hasEmergencyPhone = await this.emergencyPhoneInput.count();
      if (hasEmergencyPhone > 0) {
        await this.ensureVisible(this.emergencyPhoneInput, 15000);
        await this.emergencyPhoneInput.fill(details.emergencyPhoneNumber);
      }
    }

    const hasEmployeeStatus = await this.employeeStatusDropdown.count();
    if (hasEmployeeStatus > 0) {
      await this.ensureVisible(this.employeeStatusDropdown, 15000);
      await this.selectDropdownOption(this.employeeStatusDropdown, details.employeeStatus ?? 'Active');
    }

    const hasEmploymentType = await this.employmentTypeDropdown.count();
    if (hasEmploymentType > 0) {
      await this.ensureVisible(this.employmentTypeDropdown, 15000);
      await this.selectDropdownOption(this.employmentTypeDropdown, details.employmentType ?? 'Full time');
    }

    if (details.acadmicQualification) {
      const hasQualification = await this.qualificationInput.count();
      if (hasQualification > 0) {
        await this.ensureVisible(this.qualificationInput, 15000);
        await this.qualificationInput.fill(details.acadmicQualification);
      }
    }

    if (details.totalExperince !== undefined) {
      const hasExperience = await this.experienceInput.count();
      if (hasExperience > 0) {
        await this.ensureVisible(this.experienceInput, 15000);
        await this.experienceInput.fill(String(details.totalExperince));
      }
    }

    const hasJoiningDate = await this.dateOfJoiningDatePicker.count();
    if (hasJoiningDate > 0) {
      await this.ensureVisible(this.dateOfJoiningDatePicker, 15000);
      await this.selectToday(this.dateOfJoiningDatePicker);
    }

    if (qualificationCertificatePath) {
      await this.uploadRelevantTeacherFiles(qualificationCertificatePath, 'Upload Qualification Certificate');
    }

    if (experienceCertificatePath) {
      await this.uploadRelevantTeacherFiles(experienceCertificatePath, 'Upload Experience Certificate');
    }

    const nextButtonCount = await this.nextButton.count();
    if (nextButtonCount > 0) {
      await this.ensureVisible(this.nextButton, 15000);
      await this.nextButton.click();
    }
  }

  async fillTeacherBankDetails(details: TeacherBankDetails) {
    if (details.basicSalary !== undefined) {
      await this.basicSalaryInput.scrollIntoViewIfNeeded();
      await this.basicSalaryInput.fill(String(details.basicSalary));
    }

    await this.ifscInput.scrollIntoViewIfNeeded();
    await this.ifscInput.fill(details.ifsc);
    await this.ifscInput.press('Tab');
    await this.page.waitForTimeout(1000);

    await this.bankNameInput.waitFor({ state: 'visible', timeout: 15000 });
    const bankNameValue = (await this.bankNameInput.inputValue()).trim();
    if (!bankNameValue) {
      await this.bankNameInput.evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = 'State Bank of India';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
      });
    }

    await this.accountNumberInput.scrollIntoViewIfNeeded();
    await this.accountNumberInput.fill(details.accountNumber);
    await this.confirmAccountNumberInput.scrollIntoViewIfNeeded();
    await this.confirmAccountNumberInput.fill(details.confirmAccountNumber);
    await this.accountHolderNameInput.scrollIntoViewIfNeeded();
    await this.accountHolderNameInput.fill(details.accountHolderName);
    await this.effectiveFromDatePicker.scrollIntoViewIfNeeded();
    await this.selectToday(this.effectiveFromDatePicker);
    await this.addTeacherButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.addTeacherButton.scrollIntoViewIfNeeded();
    await this.addTeacherButton.click({ timeout: 30000 });
    await this.confirmAddButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.confirmAddButton.scrollIntoViewIfNeeded();
    await this.confirmAddButton.click({ timeout: 30000 });
  }
}
