import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AddTeacherPage } from '../pages/AddTeacherPage';
import { DataGenerator } from '../utils/DataGenerator';

const LOGIN_EMAIL = 'vikasp@yopmail.com';
const LOGIN_PASSWORD = 'Demo@1234';
test.describe('Add Teacher', () => {
  test('should add a new teacher with unique details', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const teacherPage = new AddTeacherPage(page);

    const firstName = DataGenerator.firstName();
    const lastName = DataGenerator.lastName();
    const email = DataGenerator.email(firstName);
    const phone = DataGenerator.phoneNumber();
    const docNumber = DataGenerator.documentNumber();
    const dobYear = DataGenerator.teacherDobYearForAge(25, 45);
    const ifsc = 'UTIB0004811';
    const bankName = DataGenerator.bankNameFromIfsc(ifsc);
    const accountNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await teacherPage.openAddTeacherForm();

    await teacherPage.fillTeacherBasicDetails({
      firstName,
      lastName,
      email,
      phone,
      gender: 'Male',
      dobYear,
      verificationDocType: 'Aadhaar card',
      verificationDocNumber: docNumber,
      hasHealthIssue: 'No',
      maritalStatus: 'Married',
      bloodGroup: 'O+',
      addressType: 'Permanent',
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      pinCode: '110001',
      address: 'H.No. 123, Sector 15',
      contactName: `${firstName} ${lastName}`,
      relationship: 'Father',
      emergencyPhoneNumber: DataGenerator.phoneNumber(),
    },
      DataGenerator.profileImage(firstName),
      DataGenerator.documentImage(`${firstName}-aadhaar-front`),
      DataGenerator.documentImage(`${firstName}-aadhaar-back`),
    );

    await teacherPage.fillTeacherProfessionalDetails({
      employeeStatus: 'Active',
      employmentType: 'Full time',
      acadmicQualification: 'B.Ed',
      totalExperince: 3,
    },
      DataGenerator.documentImage(`${firstName}-qualification`),
      DataGenerator.documentImage(`${firstName}-experience`),
    );

    await teacherPage.fillTeacherBankDetails({
      ifsc,
      bankName,
      basicSalary: 45000,
      accountNumber,
      confirmAccountNumber: accountNumber,
      accountHolderName: `${firstName} ${lastName}`,
    });

    await expect(page.getByText(/Teacher added successfully|Teacher added/i)).toBeVisible();
    console.log(`Teacher successfully added: ${firstName} ${lastName}`);
  });
});
