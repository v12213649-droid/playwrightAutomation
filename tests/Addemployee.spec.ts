import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { DataGenerator } from '../utils/DataGenerator';

const LOGIN_EMAIL = 'vikasp@yopmail.com';
const LOGIN_PASSWORD = 'Demo@1234';

test.describe('Employee Module - Add Employee', () => {
  test('should add a new employee following the 46-step wizard sequence with unique data', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const employeePage = new AddEmployeePage(page);

    // ==========================================
    // 0. Login with authorized credentials
    // ==========================================
    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    // ==========================================
    // 1. Element 1: Employee Card on Manage Dashboard
    // ==========================================
    console.log('Step 1: Navigating to Employee module...');
    await employeePage.navigateToEmployeeModule();
    await expect(page).toHaveURL(/.*school-management\/employee/);

    // ==========================================
    // 2. Element 2: Add employee button
    // ==========================================
    console.log('Step 2: Clicking Add employee button...');
    await employeePage.clickAddEmployee();
    await expect(page).toHaveURL(/.*school-management\/employee\/add/);

    // ==========================================
    // Generate unique test data for the Employee
    // ==========================================
    const firstName = DataGenerator.firstName();
    const lastName = DataGenerator.lastName();
    const email = DataGenerator.email(firstName);
    const phone = DataGenerator.phoneNumber();
    const dobYear = DataGenerator.teacherDobYearForAge(25, 45);
    const docNumber = DataGenerator.documentNumber();
    const emergencyName = `Dr. ${DataGenerator.firstName()} ${lastName}`;
    const emergencyPhone = DataGenerator.phoneNumber();
    const accountNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const profileImagePath = DataGenerator.randomJpgImage('employee-profile');

    console.log(`Starting Add Employee Flow for: ${firstName} ${lastName} (${email})`);

    // ==========================================
    // Step 1: Personal Details (Elements 3 - 20)
    // ==========================================
    console.log('Filling Step 1: Personal Details...');
    await employeePage.fillPersonalDetails({
      firstName,
      lastName,
      email,
      gender: 'Male',
      dobYear,
      phone,
      category: 'SC',
      bloodGroup: 'B-',
      verificationDocType: 'Aadhaar card',
      verificationDocNumber: docNumber,
      emergencyContactName: emergencyName,
      emergencyContactNumber: emergencyPhone,
      hasHealthIssue: 'yes',
      healthIssueDetails: 'None / Healthy physical condition',
    });

    // ==========================================
    // Step 2: Job, Salary & Bank Details (Elements 21 - 35)
    // ==========================================
    console.log('Filling Step 2: Job, Salary & Bank Details...');
    await employeePage.fillJobAndBankDetails({
      firstName,
      lastName,
      email,
      gender: 'Male',
      dobYear,
      phone,
      verificationDocNumber: docNumber,
      emergencyContactName: emergencyName,
      emergencyContactNumber: emergencyPhone,
      role: 'Admin',
      employementType: 'Full-time',
      salaryType: 'Monthly',
      basicSalary: 45000,
      ifsc: 'CITI0000032',
      accountNumber,
      confirmAccountNumber: accountNumber,
      accountHolderName: `${firstName} ${lastName}`,
    });

    // ==========================================
    // Step 3: Address Details (Elements 36 - 44)
    // ==========================================
    console.log('Filling Step 3: Address Details...');
    await employeePage.fillAddressDetails({
      firstName,
      lastName,
      email,
      gender: 'Male',
      dobYear,
      phone,
      verificationDocNumber: docNumber,
      emergencyContactName: emergencyName,
      emergencyContactNumber: emergencyPhone,
      typeOfAddress: 'Permanent',
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      pinCode: '110001',
      addressLine1: `Flat ${Math.floor(100 + Math.random() * 900)}, Greenfield Avenue`,
      addressLine2: 'Near Central Plaza',
    });

    // ==========================================
    // Step 4: Documents & Final Submit (Elements 45 - 46)
    // ==========================================
    console.log(`Step 4: Uploading profile image (${profileImagePath}) and submitting...`);
    await employeePage.uploadProfileImageAndSubmit(profileImagePath);

    // Verify completion
    await page.waitForTimeout(2000);
    console.log(`Employee successfully added: ${firstName} ${lastName}`);
  });
});
