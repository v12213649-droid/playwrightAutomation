import { expect, test } from '@playwright/test';
import { AddAttendancePage, AttendanceStatus } from '../../pages/attendance/AddAttendancePage';
import { LoginPage } from '../../pages/common/LoginPage';
import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';

const STUDENT_HISTORY_DATA = {
  className: '8',
  section: 'A',
  studentName: 'Om Rao',
};

const CLASS_REPORT_DATA = {
  className: '8',
  section: 'A',
  fromDate: new Date(),
  toDate: new Date(),
};

const DAILY_VIEW_DATE = new Date();

const ATTENDANCE_DATA: {
  className: string;
  section: string;
  attendanceDate: Date;
  studentName: string;
  status: AttendanceStatus;
} = {
  className: '9',
  section: 'A',
  attendanceDate: new Date(),
  studentName: 'Om Rao',
  status: 'Absent',
};

test.describe('Attendance Module', () => {
  test.describe.configure({ mode: 'serial' });

  test('should mark attendance for the configured student', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    await attendancePage.markAttendance(ATTENDANCE_DATA);

    await expect(
      page.locator('tr').filter({ has: page.getByText(ATTENDANCE_DATA.studentName, { exact: true }) }).first()
    ).toContainText(ATTENDANCE_DATA.status);

    await page.waitForTimeout(10000);
  });

  test('should mark all students present and save attendance', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await attendancePage.navigateToMarkAttendance();
    await attendancePage.loadStudents(ATTENDANCE_DATA);

    await attendancePage.markAllPresent();
    await attendancePage.saveAttendance();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });

  test('should mark all students absent and save attendance', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await attendancePage.navigateToMarkAttendance();
    await attendancePage.loadStudents(ATTENDANCE_DATA);

    await attendancePage.markAllAbsent();
    await attendancePage.saveAttendance();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });

  test('should clear attendance filters after loading students', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await attendancePage.navigateToMarkAttendance();
    await attendancePage.loadStudents(ATTENDANCE_DATA);

    await attendancePage.clearAttendanceFilters();
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });

  test('should view attendance history for the configured student', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await attendancePage.viewStudentHistory(STUDENT_HISTORY_DATA);
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });

  test('should show the configured class attendance report', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await attendancePage.showClassReport(CLASS_REPORT_DATA);
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });

  test('should view daily attendance for the configured date', async ({ page }) => {
    test.setTimeout(120000);
    const loginPage = new LoginPage(page);
    const attendancePage = new AddAttendancePage(page);

    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await attendancePage.viewDailyAttendance(DAILY_VIEW_DATE);
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(10000);
  });
});
