import { expect, test } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { AddStudentPage } from '../pages/AddStudentPage';
import { DataGenerator } from '../utils/DataGenerator';

const LOGIN_EMAIL = 'vikasp@yopmail.com';
const LOGIN_PASSWORD = 'Demo@1234';

test.describe('Add Student', () => {
  test('should add a new student with unique details', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const addStudentPage = new AddStudentPage(page);

    // ---------- Generate unique test data ----------
    const studentFirstName = DataGenerator.firstName();
    const studentLastName = DataGenerator.lastName();
    const guardianFirstName = DataGenerator.firstName();
    const guardianLastName = DataGenerator.lastName();
    const studentClass = DataGenerator.randomClass();
    const studentDobYear = DataGenerator.studentDobYearForClass(studentClass);
    const guardianDobYear = DataGenerator.guardianDobYearForStudent(studentDobYear);
    const studentPhotoPath = DataGenerator.profileImage(studentFirstName);
    const documentPhotoPath = DataGenerator.documentImage(guardianFirstName);

    // ---------- Login ----------
    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);

    // ---------- Open Add Student wizard ----------
    await addStudentPage.openAddStudentForm();

    // ---------- Step 1: Student basic details ----------
    await addStudentPage.fillStudentDetails(
      {
        firstName: studentFirstName,
        lastName: studentLastName,
        email: DataGenerator.email(studentFirstName),
        phone: DataGenerator.phoneNumber(),
        gender: 'Male', // TODO: confirm exact option label in the app
        dobYear: studentDobYear,
        category: 'GENERAL',
      },
      studentPhotoPath,
    );
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);

    // ---------- Step 2: Academic details ----------
    await addStudentPage.fillAcademicDetails({
      className: studentClass,
      section: 'A',
      admissionType: 'New admission',
    });
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);

    // ---------- Step 3: Address details ----------
    await addStudentPage.fillAddressDetails({
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      pinCode: '110001',
      addressLine1: 'H.No. 123, Sector 15',
      addressLine2: 'Near City Park',
    });
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);

    // ---------- Step 4: Guardian details ----------
    await addStudentPage.fillGuardianDetails(
      {
        relationType: 'Father',
        firstName: guardianFirstName,
        lastName: guardianLastName,
        dobYear: guardianDobYear,
        phone: DataGenerator.phoneNumber(),
        email: DataGenerator.email(guardianFirstName),
        docType: 'Aadhaar Card',
        docNumber: DataGenerator.documentNumber(),
      },
      documentPhotoPath,
    );

    // ---------- Verify success ----------
    await expect(page.getByText('Student added successfully', { exact: true })).toBeVisible();
    console.log(`Student successfully added: ${studentFirstName} ${studentLastName}`);

    // Keep the browser open briefly for manual verification.
    await page.waitForTimeout(30000);
  });
});