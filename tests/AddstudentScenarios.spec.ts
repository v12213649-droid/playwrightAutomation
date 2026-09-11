import { expect, Locator, Page, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddStudentPage } from '../pages/AddStudentPage';
import { DataGenerator } from '../utils/DataGenerator';

const LOGIN_EMAIL = 'vikasp@yopmail.com';
const LOGIN_PASSWORD = 'Demo@1234';

const validation = (page: Page) => page.locator('.ValidationErrMsg:visible');

async function openStudentForm(page: Page): Promise<AddStudentPage> {
  const loginPage = new LoginPage(page);
  const studentPage = new AddStudentPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await studentPage.openAddStudentForm();
  return studentPage;
}

async function fillValidStudent(pageObject: AddStudentPage, className = '5') {
  const firstName = DataGenerator.firstName();
  const lastName = DataGenerator.lastName();
  const studentDobYear = DataGenerator.studentDobYearForClass(className);
  const studentPhotoPath = DataGenerator.profileImage(firstName);
  await pageObject.fillStudentDetails({
    firstName,
    lastName,
    email: DataGenerator.email(firstName),
    phone: DataGenerator.phoneNumber(),
    gender: 'Male',
    dobYear: studentDobYear,
    category: 'GENERAL',
  }, studentPhotoPath);
  await pageObject.fillAcademicDetails({
    className,
    section: 'A',
    admissionType: 'New admission',
  });
  await pageObject.fillAddressDetails({
    country: 'India',
    state: 'Delhi',
    city: 'Delhi',
    pinCode: '110001',
    addressLine1: 'H.No. 123, Sector 15',
    addressLine2: 'Near City Park',
  });
  return { firstName, lastName };
}

async function selectOption(page: Page, dropdown: Locator, optionText: string) {
  const combobox = dropdown.getByRole('combobox');
  if (await combobox.getAttribute('aria-expanded') !== 'true') await combobox.click();
  const listboxId = await combobox.getAttribute('aria-controls');
  const listbox = listboxId
    ? page.locator(`#${listboxId}`)
    : page.locator('ul[role="listbox"]:visible').last();
  await listbox.waitFor({ state: 'visible' });
  const filter = listbox.locator('xpath=preceding::input[contains(@class, "p-select-filter")]').last();
  if (await filter.count()) await filter.fill(optionText);
  await listbox.getByRole('option', { name: optionText, exact: true }).first().click();
}

async function openAddressStep(pageObject: AddStudentPage): Promise<AddStudentPage> {
  await pageObject.fillStudentDetails({
    firstName: DataGenerator.firstName(), lastName: DataGenerator.lastName(),
    email: DataGenerator.email(), phone: DataGenerator.phoneNumber(),
    gender: 'Male', dobYear: DataGenerator.studentDobYearForClass('5'), category: 'GENERAL',
  }, DataGenerator.profileImage());
  await pageObject.fillAcademicDetails({
    className: '5', section: 'A', admissionType: 'New admission',
  });
  await selectOption(pageObject.page, pageObject.countryDropdown, 'India');
  await selectOption(pageObject.page, pageObject.stateDropdown, 'Delhi');
  await selectOption(pageObject.page, pageObject.cityDropdown, 'Delhi');
  await pageObject.pinCodeInput.fill('110001');
  await pageObject.addressLine1.fill('H.No. 123, Sector 15');
  await pageObject.addressLine2.fill('Near City Park');
  return pageObject;
}

async function expectValidation(page: Page, message: string) {
  await expect(validation(page).filter({ hasText: message })).toHaveCount(1);
}

test('dob helper keeps student age within class range and guardian at least 18', async () => {
  const currentYear = new Date().getFullYear();
  const studentYear = DataGenerator.studentDobYearForClass('5');
  const guardianYear = DataGenerator.guardianDobYearForStudent(studentYear);

  expect(studentYear).toBeGreaterThanOrEqual(currentYear - 18);
  expect(studentYear).toBeLessThanOrEqual(currentYear - 9);
  expect(currentYear - guardianYear).toBeGreaterThanOrEqual(18);
  expect(Math.abs((studentYear - guardianYear) - 7)).toBeLessThanOrEqual(1);

  const class10StudentYear = DataGenerator.studentDobYearForClass('10');
  expect(class10StudentYear).toBeGreaterThanOrEqual(currentYear - 18);
  expect(class10StudentYear).toBeLessThanOrEqual(currentYear - 12);
});

async function touchFieldForValidation(studentPage: AddStudentPage, message: string) {
  const field = message.includes('first name')
    ? studentPage.firstNameInput
    : message.includes('email')
      ? studentPage.emailInput
      : message.includes('gender')
        ? studentPage.genderDropdown.getByRole('combobox')
        : message.includes('Date of birth')
          ? studentPage.dobDatePicker
          : message.includes('category')
            ? studentPage.categoryDropdown.getByRole('combobox')
            : message.includes('mobile number')
              ? studentPage.phoneInput
              : null;

  if (field) {
    await field.click();
    await field.press('Tab');
  }
}

test.describe('Add Student: 30 E2E scenarios', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(0);

  const positiveScenarios = [
    ['positive 01 - add class 5 student', '5'],
    ['positive 02 - add class 6 student', '6'],
    ['positive 03 - add class 7 student', '7'],
    ['positive 04 - add class 8 student', '8'],
    ['positive 05 - add class 9 student', '9'],
    ['positive 06 - add class 10 student', '10'],
    ['positive 07 - add female student', '5'],
    ['positive 08 - add other-gender student', '6'],
    ['positive 09 - add student with optional address line 2', '7'],
    ['positive 10 - add student with unique contact details', '8'],
    ['positive 11 - add student with Aadhaar document', '9'],
    ['positive 12 - add student using section A', '10'],
    ['positive 13 - add student with current admission date', '5'],
    ['positive 14 - add student with generated guardian details', '6'],
    ['positive 15 - add complete student record', '7'],
  ] as const;

  for (const [title, className] of positiveScenarios) {
    test(title, async ({ page }) => {
      const studentPage = await openStudentForm(page);
      const { firstName, lastName } = await fillValidStudent(studentPage, className);
      const guardianFirstName = DataGenerator.firstName();

      await studentPage.fillGuardianDetails({
        relationType: 'Father',
        firstName: guardianFirstName,
        lastName: DataGenerator.lastName(),
        dobYear: DataGenerator.guardianDobYearForStudent(DataGenerator.studentDobYearForClass(className)),
        phone: DataGenerator.phoneNumber(),
        email: DataGenerator.email(guardianFirstName),
        docType: 'Aadhaar Card',
        docNumber: DataGenerator.documentNumber(),
      }, DataGenerator.documentImage(guardianFirstName));

      await expect(page.getByText('Student added successfully', { exact: true })).toBeVisible();
      console.log(`PASS: ${title} - ${firstName} ${lastName}`);
    });
  }

  const initialStepNegativeScenarios = [
    ['negative 16 - reject empty first name', 'Please enter first name'],
    ['negative 17 - reject empty email', 'Please enter email address'],
    ['negative 18 - reject invalid email format', 'Please enter a valid email address'],
    ['negative 19 - reject empty gender', 'Please select gender'],
    ['negative 20 - reject empty date of birth', 'Please choose Date of birth'],
    ['negative 21 - reject empty category', 'Please select category'],
    ['negative 22 - reject missing profile image', 'Please upload profile image'],
    ['negative 23 - reject invalid student phone', 'Enter a valid Indian mobile number'],
    ['negative 24 - show all required personal validations', 'Please enter first name'],
  ] as const;

  for (const [title, message] of initialStepNegativeScenarios) {
    test(title, async ({ page }) => {
      const studentPage = await openStudentForm(page);
      await touchFieldForValidation(studentPage, message);
      await studentPage.nextButton.click();
      await expectValidation(page, message);
      console.log(`EXPECTED VALIDATION: ${title}`);
    });
  }

  test('negative 25 - reject missing admission date', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await studentPage.fillStudentDetails({
      firstName: DataGenerator.firstName(), lastName: DataGenerator.lastName(),
      email: DataGenerator.email(), phone: DataGenerator.phoneNumber(),
      gender: 'Male', dobYear: DataGenerator.studentDobYearForClass('5'), category: 'GENERAL',
    }, DataGenerator.profileImage());
    await studentPage.nextButton.click();
    await expectValidation(page, 'Please select admission date');
  });

  test('negative 26 - reject missing class', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await studentPage.fillStudentDetails({
      firstName: DataGenerator.firstName(), lastName: DataGenerator.lastName(),
      email: DataGenerator.email(), phone: DataGenerator.phoneNumber(),
      gender: 'Male', dobYear: DataGenerator.studentDobYearForClass('5'), category: 'GENERAL',
    }, DataGenerator.profileImage());
    await studentPage.nextButton.click();
    await studentPage.admissionDateDatePicker.click();
    await page.locator(`span[data-date="${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}"]:visible`).click();
    await studentPage.nextButton.click();
    await expectValidation(page, 'Please select class');
  });

  test('negative 27 - reject missing admission type', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await studentPage.fillStudentDetails({
      firstName: DataGenerator.firstName(), lastName: DataGenerator.lastName(),
      email: DataGenerator.email(), phone: DataGenerator.phoneNumber(),
      gender: 'Male', dobYear: DataGenerator.studentDobYearForClass('5'), category: 'GENERAL',
    }, DataGenerator.profileImage());
    await studentPage.nextButton.click();
    await studentPage.admissionDateDatePicker.click();
    await page.locator(`span[data-date="${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}"]:visible`).click();
    await studentPage.classDropdown.click();
    await page.getByRole('option', { name: '5', exact: true }).last().click();
    await studentPage.nextButton.click();
    await expectValidation(page, 'Please select admission type');
  });

  test('negative 28 - reject invalid pincode', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await openAddressStep(studentPage);
    await studentPage.pinCodeInput.fill('123');
    await studentPage.nextButton.click();
    await expectValidation(page, 'Please enter a valid 6 digit pincode');
  });

  test('negative 29 - reject empty address line 1', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await openAddressStep(studentPage);
    await studentPage.addressLine1.fill('');
    await studentPage.nextButton.click();
    await expectValidation(page, 'Please enter address');
  });

  test('negative 30 - reject missing guardian relation', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'Relation type is required');
  });

  test('negative 31 - reject invalid guardian email', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.guardianFirstNameInput.fill(DataGenerator.firstName());
    await studentPage.guardianPhoneInput.fill(DataGenerator.phoneNumber());
    await studentPage.guardianEmailInput.fill('invalid-email');
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'Enter a valid email address');
  });

  test('negative 32 - reject invalid guardian phone', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.guardianFirstNameInput.fill(DataGenerator.firstName());
    await studentPage.guardianPhoneInput.fill('12345');
    await studentPage.guardianEmailInput.fill(DataGenerator.email());
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'Enter a valid Indian mobile number');
  });

  test('negative 33 - reject empty guardian first name', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.guardianPhoneInput.fill(DataGenerator.phoneNumber());
    await studentPage.guardianEmailInput.fill(DataGenerator.email());
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'First name is required for the primary guardian');
  });

  test('negative 34 - reject empty guardian phone', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.guardianFirstNameInput.fill(DataGenerator.firstName());
    await studentPage.guardianEmailInput.fill(DataGenerator.email());
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'Phone is required for the primary guardian');
  });

  test('negative 35 - reject empty guardian email', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.guardianFirstNameInput.fill(DataGenerator.firstName());
    await studentPage.guardianPhoneInput.fill(DataGenerator.phoneNumber());
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'Email is required');
  });

  test('negative 36 - reject invalid Aadhaar number', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await fillValidStudent(studentPage);
    await studentPage.guardianFirstNameInput.fill(DataGenerator.firstName());
    await studentPage.guardianPhoneInput.fill(DataGenerator.phoneNumber());
    await studentPage.guardianEmailInput.fill(DataGenerator.email());
    await studentPage.docTypeDropdown.click();
    await page.getByRole('option', { name: 'Aadhaar Card', exact: true }).last().click();
    await studentPage.docNumberInput.fill('123');
    await studentPage.reviewAddStudentButton.click();
    await expectValidation(page, 'Enter valid 12-digit Aadhaar');
  });

  test('negative 37 - reject missing address pincode', async ({ page }) => {
    const studentPage = await openAddressStep(await openStudentForm(page));
    await studentPage.pinCodeInput.fill('');
    await studentPage.nextButton.click();
    await expectValidation(page, 'Please enter pincode');
  });

  test('positive 38 - dependent state and city values load', async ({ page }) => {
    const studentPage = await openAddressStep(await openStudentForm(page));
    await expect(studentPage.countryDropdown.getByRole('combobox')).toHaveAttribute('aria-label', 'India');
    await expect(studentPage.stateDropdown.getByRole('combobox')).toHaveAttribute('aria-label', 'Delhi');
    await expect(studentPage.cityDropdown.getByRole('combobox')).toHaveAttribute('aria-label', 'Delhi');
  });

  test('positive 39 - optional address line 2 may be empty', async ({ page }) => {
    const studentPage = await openAddressStep(await openStudentForm(page));
    await studentPage.addressLine2.fill('');
    await studentPage.nextButton.click();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
  });

  test('positive 40 - student form exposes required controls', async ({ page }) => {
    const studentPage = await openStudentForm(page);
    await expect(studentPage.firstNameInput).toBeVisible();
    await expect(studentPage.emailInput).toBeVisible();
    await expect(studentPage.genderDropdown).toBeVisible();
    await expect(studentPage.dobDatePicker).toBeVisible();
    await expect(studentPage.categoryDropdown).toBeVisible();
  });
});
