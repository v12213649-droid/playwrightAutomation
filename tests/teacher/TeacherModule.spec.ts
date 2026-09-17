import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { AddTeacherPage } from '../../pages/teacher/AddTeacherPage';
import { DataGenerator } from '../../utils/DataGenerator';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

test.describe('Teacher Module', () => {
  test('should add a new teacher with unique details', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const teacherPage = new AddTeacherPage(page);
    const firstName = DataGenerator.firstName();
    const lastName = DataGenerator.lastName();
    const ifsc = 'UTIB0004811';
    const accountNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await teacherPage.openAddTeacherForm();
    await teacherPage.fillTeacherBasicDetails({
      firstName,
      lastName,
      email: DataGenerator.email(firstName),
      phone: DataGenerator.phoneNumber(),
      gender: 'Male',
      dobYear: DataGenerator.teacherDobYearForAge(25, 45),
      verificationDocType: 'Aadhaar card',
      verificationDocNumber: DataGenerator.documentNumber(),
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
    }, DataGenerator.profileImage(firstName), DataGenerator.documentImage(`${firstName}-aadhaar-front`), DataGenerator.documentImage(`${firstName}-aadhaar-back`));
    await teacherPage.fillTeacherProfessionalDetails({
      employeeStatus: 'Active',
      employmentType: 'Full time',
      acadmicQualification: 'B.Ed',
      totalExperince: 3,
    }, DataGenerator.documentImage(`${firstName}-qualification`), DataGenerator.documentImage(`${firstName}-experience`));
    await teacherPage.fillTeacherBankDetails({
      ifsc,
      bankName: DataGenerator.bankNameFromIfsc(ifsc),
      basicSalary: 45000,
      accountNumber,
      confirmAccountNumber: accountNumber,
      accountHolderName: `${firstName} ${lastName}`,
    });
    await expect(page.getByText(/Teacher added successfully|Teacher added/i)).toBeVisible();
  });
});
