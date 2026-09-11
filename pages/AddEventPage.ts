import { Page, Locator, expect } from '@playwright/test';

export interface EventDetails {
  title: string;
  targetAudience?: string; // 'Everyone (Whole School)' | 'All Teachers' | 'All Parents' | 'All Students'
  eventType?: string;      // 'Sports' | 'Cultural' | 'Academic' | 'Exam' | etc.
  description: string;
  daysFromToday?: number;  // Default: 4 days after current date
  venue?: string;
  status?: 'published' | 'draft' | 'cancelled'; // Default: 'published'
  attachmentPath?: string;
  enableTimeBased?: boolean;
  startTime?: string;      // '10:00'
  endTime?: string;        // '14:00'
}

export class AddEventPage {
  readonly page: Page;

  // 1. Navigation & Event Module Card
  readonly manageNavLink: Locator;
  readonly eventModuleCard: Locator;

  // 2. Add Event Button
  readonly addEventButton: Locator;

  // 3. Target Audience Dropdown
  readonly targetAudienceDropdown: Locator;

  // 4 & 5. SMS and Email Checkboxes
  readonly sendSmsCheckbox: Locator;
  readonly sendEmailCheckbox: Locator;

  // 6. Event Type Dropdown & Event Name Input
  readonly eventTypeDropdown: Locator;
  readonly eventNameInput: Locator;

  // 7. Event Description Textarea
  readonly descriptionTextarea: Locator;

  // 8. File Upload Input
  readonly fileUploadInput: Locator;

  // 9. Start Date Datepicker
  readonly startDateInput: Locator;

  // 10. End Date Datepicker
  readonly endDateInput: Locator;

  // 11. Venue Input
  readonly venueInput: Locator;

  // 12 & 13. Event Status Select Dropdown
  readonly eventStatusSelect: Locator;

  // 14 & 15. Time Based Checkbox
  readonly timeBasedCheckbox: Locator;

  // 16 & 17. Start Time & End Time Inputs
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;

  // 18. Add Event Submit Button
  readonly submitEventButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 1. Manage Navigation & Event Card
    this.manageNavLink = page
      .locator('a[routerlink="/school-management"], a:has-text("Manage")')
      .first();
    this.eventModuleCard = page
      .locator('div.card:has(h3:text-is("Event")), h3:text-is("Event")')
      .first();

    // 2. Add Event Button
    this.addEventButton = page
      .locator('button[routerlink="/school-management/event/add-event"], button.add-btn:has-text("Add Event")')
      .first();

    // 3. Target Audience Dropdown
    this.targetAudienceDropdown = page.locator('p-select[formcontrolname="targetAudience"]');

    // 4 & 5. Checkboxes
    this.sendSmsCheckbox = page.locator('p-checkbox[formcontrolname="sendSMS"], input#sms');
    this.sendEmailCheckbox = page.locator('p-checkbox[formcontrolname="sendEmail"], input#email');

    // 6. Event Type Dropdown & Event Name Input
    this.eventTypeDropdown = page.locator('p-select[formcontrolname="eventType"]');
    this.eventNameInput = page.locator('input[formcontrolname="eventName"], input[placeholder*="event title"]');

    // 7. Description Textarea
    this.descriptionTextarea = page.locator('textarea[formcontrolname="description"]');

    // 8. File upload input
    this.fileUploadInput = page.locator('input.file-upload-input, input[type="file"]').first();

    // 9 & 10. Start and End Date Datepickers
    this.startDateInput = page.locator('p-datepicker[formcontrolname="startDate"] input');
    this.endDateInput = page.locator('p-datepicker[formcontrolname="endDate"] input');

    // 11. Venue Input
    this.venueInput = page.locator('input[formcontrolname="venue"]');

    // 12 & 13. Event Status Select
    this.eventStatusSelect = page.locator('select[formcontrolname="eventStatus"]');

    // 14 & 15. Time based checkbox
    this.timeBasedCheckbox = page.locator('input#timeBased, p-checkbox#timeBased input');

    // 16 & 17. Time pickers
    this.startTimeInput = page.locator('p-datepicker[formcontrolname="startTime"] input, .p-datepicker-input').first();
    this.endTimeInput = page.locator('p-datepicker[formcontrolname="endTime"] input, .p-datepicker-input').last();

    // 18. Submit Button
    this.submitEventButton = page.locator('button.add-btn:has-text("Add event")').last();
  }

  // ---------------- Navigation ----------------

  /** Step 1: Navigate to Event module via Manage menu */
  async navigateToEventModule() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.eventModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.eventModuleCard.click();
    await this.page.waitForTimeout(500);
  }

  /** Step 2: Click Add Event button */
  async clickAddEvent() {
    await this.addEventButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addEventButton.click();
    await this.page.waitForTimeout(500);
  }

  // ---------------- Form Fields ----------------

  /** Step 3: Select Target Audience from dropdown */
  async selectTargetAudience(audience = 'Everyone (Whole School)') {
    await this.targetAudienceDropdown.scrollIntoViewIfNeeded();
    await this.targetAudienceDropdown.click();
    await this.page.waitForTimeout(300);

    const option = this.page.locator(`li[role="option"]:has-text("${audience}"), p-selectitem:has-text("${audience}")`).first();
    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
      await option.click();
    } else {
      // Pick first available option if requested is not found
      const firstOption = this.page.locator('li[role="option"]').first();
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
    }
    await this.page.waitForTimeout(200);
  }

  /** Steps 4 & 5: Check SMS / Email notification if enabled */
  async toggleNotifications() {
    const isSmsVisible = await this.sendSmsCheckbox.isVisible().catch(() => false);
    if (isSmsVisible) {
      const isDisabled = await this.sendSmsCheckbox.getAttribute('disabled').catch(() => null);
      if (!isDisabled) {
        await this.sendSmsCheckbox.check({ force: true }).catch(() => { });
      }
    }
  }

  /** Step 6: Select Event Category / Type */
  async selectEventType(category = 'Sports') {
    await this.eventTypeDropdown.scrollIntoViewIfNeeded();
    await this.eventTypeDropdown.click();
    await this.page.waitForTimeout(300);

    const option = this.page.locator(`li[role="option"]:has-text("${category}"), p-selectitem:has-text("${category}")`).first();
    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
      await option.click();
    } else {
      const firstOpt = this.page.locator('li[role="option"]').first();
      if (await firstOpt.isVisible().catch(() => false)) {
        await firstOpt.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
    }
    await this.page.waitForTimeout(200);
  }

  /** Step 6b: Enter Event Title / Name */
  async fillEventName(name: string) {
    if (await this.eventNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.eventNameInput.scrollIntoViewIfNeeded();
      await this.eventNameInput.fill(name);
    }
  }

  /** Step 7: Enter Event Description */
  async fillDescription(description: string) {
    await this.descriptionTextarea.scrollIntoViewIfNeeded();
    await this.descriptionTextarea.fill(description);
  }

  /** Step 8: Upload Event Poster / Image */
  async uploadAttachment(filePath: string) {
    if (filePath) {
      await this.fileUploadInput.setInputFiles(filePath);
      await this.page.waitForTimeout(300);
    }
  }

  /** Helper to select a date in PrimeNG datepicker */
  private async selectDateInPicker(input: Locator, targetDate: Date) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await this.page.waitForTimeout(300);

    const targetDay = targetDate.getDate();
    const currentMonth = new Date().getMonth();

    if (targetDate.getMonth() !== currentMonth) {
      const nextMonthBtn = this.page.locator('.p-datepicker-next-button, button[aria-label="Next Month"]').first();
      if (await nextMonthBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await nextMonthBtn.click();
        await this.page.waitForTimeout(300);
      }
    }

    const dayCell = this.page
      .locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${targetDay}"):visible`)
      .first();

    if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dayCell.click();
    } else {
      // Fallback: direct date input
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const yyyy = targetDate.getFullYear();
      await input.fill(`${dd}/${mm}/${yyyy}`);
      await input.press('Enter');
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(200);
  }

  /** Helper to select a date in next month with day specified in incremental order */
  async selectDateInNextMonth(input: Locator, day: number) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await this.page.waitForTimeout(300);

    // Click Next Month button to move to next month of current date
    const nextMonthBtn = this.page
      .locator(
        'button.p-datepicker-next-button, button[aria-label="Next Month"], button.p-datepicker-next, [data-pc-section="nextbutton"]',
      )
      .first();

    if (await nextMonthBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextMonthBtn.click();
      await this.page.waitForTimeout(300);
    }

    // Select the day in next month
    const dayCell = this.page
      .locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}"):visible`)
      .first();

    if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dayCell.click();
    } else {
      // Fallback: direct date input DD/MM/YYYY for next month
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const yyyy = targetDate.getFullYear();
      await input.fill(`${dd}/${mm}/${yyyy}`);
      await input.press('Enter');
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(200);
  }

  /** Step 9: Select Start Date in next month (in increment order) */
  async selectStartDateInNextMonth(day = 10) {
    await this.selectDateInNextMonth(this.startDateInput, day);
  }

  /** Step 10: Select End Date in next month (in increment order, day > startDay) */
  async selectEndDateInNextMonth(day = 20) {
    await this.selectDateInNextMonth(this.endDateInput, day);
  }

  /** Step 9 (Standard): Select Start Date */
  async selectStartDate(daysAhead = 4) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    await this.selectDateInPicker(this.startDateInput, targetDate);
  }

  /** Step 10 (Standard): Select End Date */
  async selectEndDate(daysAhead = 4) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    await this.selectDateInPicker(this.endDateInput, targetDate);
  }

  /** Step 11: Enter Event Venue / Location */
  async fillVenue(venue: string) {
    await this.venueInput.scrollIntoViewIfNeeded();
    await this.venueInput.fill(venue);
  }

  /** Steps 12 & 13: Select Event Status (e.g. 'published') */
  async selectEventStatus(status = 'published') {
    await this.eventStatusSelect.scrollIntoViewIfNeeded();
    await this.eventStatusSelect.selectOption(status);
  }

  /** Steps 14 & 15: Toggle Time-based option (if desired) */
  async toggleTimeBased(enable = false) {
    if (enable && await this.timeBasedCheckbox.isVisible().catch(() => false)) {
      const isChecked = await this.timeBasedCheckbox.isChecked().catch(() => false);
      if (!isChecked) {
        await this.timeBasedCheckbox.check({ force: true }).catch(() => { });
        await this.page.waitForTimeout(300);
      }
    }
  }

  /** Step 18: Click Add Event Submit Button */
  async submit() {
    await this.submitEventButton.scrollIntoViewIfNeeded();
    await expect(this.submitEventButton).toBeEnabled();
    await this.submitEventButton.click();
    await this.page.waitForTimeout(1500);
  }

  /** Complete Add Event execution flow */
  async createEvent(details: EventDetails) {
    // 3. Target Audience
    await this.selectTargetAudience(details.targetAudience || 'Everyone (Whole School)');

    // 4 & 5. Checkboxes
    await this.toggleNotifications();

    // 6. Event Type Category
    await this.selectEventType(details.eventType || 'Sports');

    // 6b. Event Title
    await this.fillEventName(details.title);

    // 7. Description
    await this.fillDescription(details.description);

    // 8. Attachment
    if (details.attachmentPath) {
      await this.uploadAttachment(details.attachmentPath);
    }

    // 9. Start Date (after 4 days of current date)
    await this.selectStartDate(details.daysFromToday ?? 4);

    // 10. End Date
    await this.selectEndDate(details.daysFromToday ?? 4);

    // 11. Venue
    await this.fillVenue(details.venue || 'Main School Auditorium');

    // 12 & 13. Event Status (Published)
    await this.selectEventStatus(details.status || 'published');

    // 14 & 15. Time based
    if (details.enableTimeBased) {
      await this.toggleTimeBased(true);
    }

    // 18. Submit
    await this.submit();
  }
}
