import { Page, Locator, expect } from '@playwright/test';

export interface PTMDetails {
  title: string;
  daysFromToday?: number; // Default: 4 days after current date
  startTime?: string;     // Default: '10:00'
  endTime?: string;       // Default: '12:00'
  description: string;
}

export class AddPTMPage {
  readonly page: Page;

  // 1. Manage Navigation Link
  readonly manageNavLink: Locator;

  // 2. PTM Module Header / Card
  readonly ptmHeading: Locator;

  // 3. Add PTM Entry Button
  readonly openAddPtmButton: Locator;

  // 4. Title Input
  readonly titleInput: Locator;

  // 5. Date of Meeting Datepicker
  readonly dateOfMeetingWrapper: Locator;
  readonly dateOfMeetingInput: Locator;

  // 6. Start Time Input / Datepicker
  readonly startTimeWrapper: Locator;
  readonly startTimeInput: Locator;

  // 7. End Time Input / Datepicker
  readonly endTimeWrapper: Locator;
  readonly endTimeInput: Locator;

  // 8. PTM Description Textarea
  readonly ptmDescriptionInput: Locator;

  // 9. Submit "Add PTM" Button
  readonly submitAddPtmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 1. <a routerlink="/school-management" class="nav-item ..."><span class="nav-text">Manage</span></a>
    this.manageNavLink = page
      .locator('a[routerlink="/school-management"], a:has-text("Manage")')
      .first();

    // 2. <h3>PTM</h3>
    this.ptmHeading = page
      .locator('h3:has-text("PTM"), a[href*="/school-management/ptm"]')
      .first();

    // 3. <button routerlink="/school-management/ptm/add-ptm" class="add-btn">Add PTM</button>
    this.openAddPtmButton = page
      .locator('button[routerlink="/school-management/ptm/add-ptm"], button.add-btn:has-text("Add PTM")')
      .first();

    // 4. <input type="text" formcontrolname="title" class="form-input-2 ...">
    this.titleInput = page.locator('input[formcontrolname="title"]');

    // 5. <p-datepicker formcontrolname="dateOfMeeting" placeholder="Select">
    this.dateOfMeetingWrapper = page.locator('p-datepicker[formcontrolname="dateOfMeeting"]');
    this.dateOfMeetingInput = page.locator('p-datepicker[formcontrolname="dateOfMeeting"] input');

    // 6. Start time input
    this.startTimeWrapper = page.locator('p-datepicker[formcontrolname="startTime"]');
    this.startTimeInput = page.locator('p-datepicker[formcontrolname="startTime"] input');

    // 7. End time input
    this.endTimeWrapper = page.locator('p-datepicker[formcontrolname="endTime"]');
    this.endTimeInput = page.locator('p-datepicker[formcontrolname="endTime"] input');

    // 8. <textarea rows="3" placeholder="Enter detailed PTM description..." formcontrolname="ptmDescription">
    this.ptmDescriptionInput = page.locator('textarea[formcontrolname="ptmDescription"]');

    // 9. <button type="button" class="add-btn"><span>Add PTM</span></button>
    this.submitAddPtmButton = page.locator('button.add-btn:has-text("Add PTM")').last();
  }

  // ---------------- Navigation ----------------

  /** Step 1: Click Manage in navigation */
  async clickManageNav() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.scrollIntoViewIfNeeded();
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);
  }

  /** Step 2: Click PTM module card / header */
  async clickPTMModule() {
    await this.ptmHeading.waitFor({ state: 'visible', timeout: 20000 });
    await this.ptmHeading.scrollIntoViewIfNeeded();
    await this.ptmHeading.click();
    await this.page.waitForTimeout(500);
  }

  /** Step 3: Click Add PTM button to navigate to form */
  async clickAddPTM() {
    await this.openAddPtmButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.openAddPtmButton.scrollIntoViewIfNeeded();
    await this.openAddPtmButton.click();
    await this.page.waitForTimeout(500);
  }

  /** Full navigation sequence from logged in dashboard to Add PTM form */
  async navigateToAddPTM() {
    await this.clickManageNav();
    await this.clickPTMModule();
    await this.clickAddPTM();
  }

  // ---------------- Form Interactions ----------------

  /** Step 4: Fill unique PTM title */
  async fillTitle(title: string) {
    await this.titleInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.titleInput.scrollIntoViewIfNeeded();
    await this.titleInput.fill(title);
  }

  /** Step 5: Select Date of Meeting (e.g. 4 days from current date) */
  async selectDateOfMeeting(daysFromToday = 4) {
    await this.dateOfMeetingInput.scrollIntoViewIfNeeded();
    await this.dateOfMeetingInput.click();
    await this.page.waitForTimeout(400);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysFromToday);
    const targetDay = targetDate.getDate();

    // Check if target day is in next month (when rolling over)
    const currentMonth = new Date().getMonth();
    if (targetDate.getMonth() !== currentMonth) {
      // Click next month navigation button if rendered in calendar
      const nextMonthBtn = this.page.locator('.p-datepicker-next-button, button[aria-label="Next Month"]').first();
      if (await nextMonthBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await nextMonthBtn.click();
        await this.page.waitForTimeout(300);
      }
    }

    // Select the target day cell
    const dayCell = this.page
      .locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${targetDay}"):visible`)
      .first();

    if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dayCell.click();
    } else {
      // Fallback: type formatted date directly DD/MM/YYYY
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const yyyy = targetDate.getFullYear();
      await this.dateOfMeetingInput.fill(`${dd}/${mm}/${yyyy}`);
      await this.dateOfMeetingInput.press('Enter');
      await this.page.keyboard.press('Escape');
    }

    await this.page.waitForTimeout(300);
  }

  /** Step 6: Fill Start Time (e.g. '10:00') */
  async fillStartTime(time = '10:00') {
    await this.startTimeInput.scrollIntoViewIfNeeded();
    await this.startTimeInput.click();
    await this.page.waitForTimeout(200);
    await this.startTimeInput.fill('');
    await this.startTimeInput.pressSequentially(time, { delay: 50 });
    await this.startTimeInput.press('Enter');
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
  }

  /** Step 7: Fill End Time (e.g. '12:00') */
  async fillEndTime(time = '12:00') {
    await this.endTimeInput.scrollIntoViewIfNeeded();
    await this.endTimeInput.click();
    await this.page.waitForTimeout(200);
    await this.endTimeInput.fill('');
    await this.endTimeInput.pressSequentially(time, { delay: 50 });
    await this.endTimeInput.press('Enter');
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
  }

  /** Step 8: Fill Description */
  async fillDescription(description: string) {
    await this.ptmDescriptionInput.scrollIntoViewIfNeeded();
    await this.ptmDescriptionInput.fill(description);
  }

  /** Step 9: Click Submit "Add PTM" button */
  async submit() {
    await this.submitAddPtmButton.scrollIntoViewIfNeeded();
    await expect(this.submitAddPtmButton).toBeEnabled();
    await this.submitAddPtmButton.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Complete Add PTM flow with provided or default details
   */
  async createPTM(details: PTMDetails) {
    // 4. Fill Title
    await this.fillTitle(details.title);

    // 5. Select Date (+4 days by default)
    await this.selectDateOfMeeting(details.daysFromToday ?? 4);

    // 6. Fill Start Time ('10:00' by default)
    await this.fillStartTime(details.startTime ?? '10:00');

    // 7. Fill End Time ('12:00' by default)
    await this.fillEndTime(details.endTime ?? '12:00');

    // 8. Fill Description
    await this.fillDescription(details.description);

    // 9. Submit
    await this.submit();
  }
}
