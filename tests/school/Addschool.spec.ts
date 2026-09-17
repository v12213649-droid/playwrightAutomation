import { test, expect } from '@playwright/test';
import { AddSchoolPage } from '../../pages/school/AddSchoolPage';
import { DataGenerator } from '../../utils/DataGenerator';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

test.describe('Add School / Registration Module', () => {
  test('should complete the add school registration sequence', async ({ page }) => {
    test.setTimeout(120000);

    const addSchoolPage = new AddSchoolPage(page);

    // ==========================================
    // 1. Generate unique test data
    // ==========================================
    const userFirstName = DataGenerator.firstName();
    const userLastName = DataGenerator.lastName();
    const userEmail = DataGenerator.email(userFirstName);
    const userPhone = DataGenerator.phoneNumber();
    const password = 'Password@12345';

    const schoolName = DataGenerator.schoolName();
    const regNumber = `CBSE/2026/${Math.floor(10000 + Math.random() * 89999)}`;
    const principalName = `Dr. ${DataGenerator.firstName()} ${DataGenerator.lastName()}`;
    const schoolEmail = `info.${DataGenerator.email(userFirstName)}`;
    const schoolPhone = DataGenerator.phoneNumber();
    const schoolWebsite = 'https://www.greenvalleyschool.in';
    const schoolLogoJpg = DataGenerator.randomJpgImage('school-logo');

    console.log(`Starting Add School Flow with:`);
    console.log(`- User: ${userFirstName} ${userLastName} (${userEmail})`);
    console.log(`- School: ${schoolName}`);
    console.log(`- JPG Logo: ${schoolLogoJpg}`);

    // ==========================================
    // 2. Step 1: Navigate to registration
    //    Element 1: <a routerlink="/auth/register">Create an account</a>
    // ==========================================
    await addSchoolPage.gotoLogin();
    await addSchoolPage.clickCreateAccount();

    // ==========================================
    // 3. Step 2: Fill Account Registration Form
    //    Elements 2-8: firstName, lastName, phone, email, password, cpassword, Create Account button
    // ==========================================
    await addSchoolPage.fillAccountRegistration({
      firstName: userFirstName,
      lastName: userLastName,
      phone: userPhone,
      email: userEmail,
      password: password,
      confirmPassword: password,
    });

    // ==========================================
    // 4. Step 3: Enter OTP Popup
    //    Elements 9-13: 4 digit OTP inputs, otp is 1234, Verify button
    // ==========================================
    await addSchoolPage.enterOtpAndVerify('1234');

    // ==========================================
    // 5. Step 4: School Basic Details
    //    Elements 14-26:
    //    - schoolName
    //    - schoolType: 'Private'
    //    - mediumOfInstruction: 'English'
    //    - regNumber
    //    - establishedOn: select current day from date picker
    //    - principalName
    //    - startTime: 08:00
    //    - endTime: 14:00
    //    - website
    //    - file upload: random JPG image
    //    - Next button
    // ==========================================
    await addSchoolPage.fillSchoolBasicDetails(
      {
        schoolName: schoolName,
        schoolType: 'Private',
        mediumOfInstruction: 'English',
        registrationNumber: regNumber,
        principalName: principalName,
        startTime: '08:00',
        endTime: '14:00',
        website: schoolWebsite,
      },
      schoolLogoJpg,
    );

    // ==========================================
    // 6. Step 5: School Contact Details
    //    Elements 27-29: emailAddress, phone, Next button
    // ==========================================
    await addSchoolPage.fillSchoolContactDetails({
      email: schoolEmail,
      phone: schoolPhone, 
    });

    // ==========================================
    // 7. Step 6: Board and School Levels
    //    Elements 30-37:
    //    - boards: 'CBSE'
    //    - checkboxes: Pre-Primary, Primary, Secondary, Higher Secondary, Senior Secondary
    //    - Next button
    // ==========================================
    await addSchoolPage.fillSchoolBoardAndLevels({
      board: 'CBSE',
      levels: [
        'Pre-Primary',
        'Primary',
        'Secondary',
        'Higher Secondary',
        'Senior Secondary',
      ],
    });

    // ==========================================
    // 8. Step 7: Address Details
    //    Country*, State*, City*, Pin Code*, Address*
    // ==========================================
    await addSchoolPage.fillAddressDetails({
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      pinCode: '110001',
      address: 'H.No. 123, Sector 15, Near City Park',
    });

    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    console.log(`Successfully completed the Add School registration flow!`);

    // Keep the browser open briefly for verification
    await page.waitForTimeout(10000);
  });
});
