import { Page, Locator, expect } from '@playwright/test';

export interface NoticeDetails {
  title: string;
  description: string;
  category?: string;       // Default: 'General'
  signature?: string;      // Default: 'Principal'
  attachmentPath?: string; // Optional image / pdf file path
  validityDays?: number;   // Number of validity days from today (default: 7)
  templateName?: string;   // Default: 'Formal Template'
}

export class AddNoticePage {
  readonly page: Page;

  // 1. Manage Navigation & Notice Card
  readonly manageNavLink: Locator;
  readonly noticeModuleCard: Locator;

  // 2. Add Notice Button
  readonly addNoticeButton: Locator;

  // 3. Title Input
  readonly titleInput: Locator;

  // 4. Description Textarea
  readonly descriptionTextarea: Locator;

  // 5. Send SMS Checkbox
  readonly sendSmsCheckbox: Locator;

  // 6. Category Select Dropdown
  readonly categoryDropdown: Locator;

  // 8. File Upload Input
  readonly fileUploadInput: Locator;

  // 9. Signature Input
  readonly signatureInput: Locator;

  // 10. Notice Date Datepicker
  readonly noticeDateInput: Locator;

  // 11. Validity Start Date Datepicker
  readonly validityStartInput: Locator;

  // 12. Validity End Date Datepicker
  readonly validityEndInput: Locator;

  // 13. Preview and Publish Button
  readonly previewAndPublishButton: Locator;

  // 14 & 15. Template Option Selection
  readonly formalTemplateOption: Locator;

  // 16. Confirm and Publish Button
  readonly confirmAndPublishButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // 1. Manage link & Notice Card
    this.manageNavLink = page
      .locator('a[routerlink="/school-management"], a:has-text("Manage")')
      .first();
    this.noticeModuleCard = page
      .locator('div.card:has(h3:has-text("Notice")), h3:text-is("Notice")')
      .first();

    // 2. Add notice button
    this.addNoticeButton = page
      .locator('button[routerlink="/school-management/notice/add-notice"], button.add-btn:has-text("Add notice")')
      .first();

    // 3. Title input
    this.titleInput = page.locator('input[formcontrolname="title"]');

    // 4. Description textarea
    this.descriptionTextarea = page.locator('textarea[formcontrolname="description"]');

    // 5. Send SMS Checkbox
    this.sendSmsCheckbox = page.locator('p-checkbox[formcontrolname="sendSMS"], input#sms');

    // 6. Category dropdown
    this.categoryDropdown = page.locator('p-select[formcontrolname="category"]');

    // 8. File upload
    this.fileUploadInput = page.locator('input.file-upload-input, input[type="file"]').first();

    // 9. Signature input
    this.signatureInput = page.locator('input[formcontrolname="signature"]');

    // 10. Notice Date datepicker
    this.noticeDateInput = page.locator('p-datepicker[formcontrolname="noticeDate"] input');

    // 11. Validity Start datepicker
    this.validityStartInput = page.locator('p-datepicker[formcontrolname="validityStart"] input');

    // 12. Validity End datepicker
    this.validityEndInput = page.locator('p-datepicker[formcontrolname="validityEnd"] input');

    // 13. Preview and Publish button
    this.previewAndPublishButton = page.locator(
      'button.btn-outline:has-text("Preview and Publish"), button:has-text("Preview and Publish")',
    );

    // 14 & 15. Template options
    this.formalTemplateOption = page.locator(
      'div.template-option:has-text("Formal Template"), li[role="option"]:has-text("Formal Template")',
    );

    // 16. Confirm and Publish button
    this.confirmAndPublishButton = page.locator(
      'button:has-text("Confirm and Publish"), button.p-button-success:has-text("Confirm and Publish")',
    );
  }

  // ---------------- Navigation ----------------

  /** Step 1: Click Manage in navigation and then Notice module card */
  async navigateToNoticeModule() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);

    await this.noticeModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.noticeModuleCard.click();
    await this.page.waitForTimeout(500);
  }

  /** Step 2: Click Add Notice button */
  async clickAddNotice() {
    await this.addNoticeButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addNoticeButton.click();
    await this.page.waitForTimeout(500);
  }

  // ---------------- Form Fields ----------------

  /** Step 3: Enter Notice Title */
  async fillTitle(title: string) {
    await this.titleInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.titleInput.fill(title);
  }

  /** Step 4: Enter Notice Description (Detailed) */
  async fillDescription(description: string) {
    await this.descriptionTextarea.waitFor({ state: 'visible', timeout: 15000 });
    await this.descriptionTextarea.fill(description);
  }

  /** Step 5: Toggle Send SMS (if enabled) */
  async checkSendSms() {
    const isVisible = await this.sendSmsCheckbox.isVisible().catch(() => false);
    if (isVisible) {
      const isDisabled = await this.sendSmsCheckbox.getAttribute('disabled').catch(() => null);
      if (!isDisabled) {
        await this.sendSmsCheckbox.check({ force: true }).catch(() => {});
      }
    }
  }

  /** Step 6 & 7: Select Category from PrimeNG dropdown */
  async selectCategory(category = 'General') {
    await this.categoryDropdown.scrollIntoViewIfNeeded();
    await this.categoryDropdown.click();
    await this.page.waitForTimeout(300);

    const option = this.page.locator(`li[role="option"]:has-text("${category}"), p-selectitem:has-text("${category}")`).first();
    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(200);
  }

  /** Step 8: Upload file attachment (optional) */
  async uploadAttachment(filePath: string) {
    if (filePath) {
      await this.fileUploadInput.setInputFiles(filePath);
      await this.page.waitForTimeout(500);
    }
  }

  /** Step 9: Fill Signature */
  async fillSignature(signature = 'Principal') {
    await this.signatureInput.scrollIntoViewIfNeeded();
    await this.signatureInput.fill(signature);
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
      // Fallback: direct input
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const yyyy = targetDate.getFullYear();
      await input.fill(`${dd}/${mm}/${yyyy}`);
      await input.press('Enter');
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(200);
  }

  /** Step 10: Select Notice Date (Current Date) */
  async selectNoticeDateCurrent() {
    const today = new Date();
    await this.selectDateInPicker(this.noticeDateInput, today);
  }

  /** Step 11: Select Validity Start Date (Current Date) */
  async selectValidityStartDate(date = new Date()) {
    await this.selectDateInPicker(this.validityStartInput, date);
  }

  /** Step 12: Select Validity End Date (e.g., today + 7 days) */
  async selectValidityEndDate(daysAhead = 7) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);
    await this.selectDateInPicker(this.validityEndInput, endDate);
  }

  /** Step 13: Click Preview and Publish */
  async clickPreviewAndPublish() {
    await this.previewAndPublishButton.scrollIntoViewIfNeeded();
    await expect(this.previewAndPublishButton).toBeEnabled();
    await this.previewAndPublishButton.click();
    await this.page.waitForTimeout(500);
  }

  /** Step 14 & 15: Select Template (e.g. Formal Template) */
  async selectTemplate(templateName = 'Formal Template') {
    const templateLocator = this.page.locator(
      `div.template-option:has-text("${templateName}"), li[role="option"]:has-text("${templateName}")`,
    ).first();

    if (await templateLocator.isVisible({ timeout: 3000 }).catch(() => false)) {
      await templateLocator.click();
      await this.page.waitForTimeout(300);
    }
  }

  /** Step 16: Click Confirm and Publish */
  async confirmAndPublish() {
    await this.confirmAndPublishButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.confirmAndPublishButton.click();
    await this.page.waitForTimeout(1500);
  }

  /** Full flow executing the complete 16-step sequence */
  async createNotice(details: NoticeDetails) {
    // 3. Title
    await this.fillTitle(details.title);

    // 4. Description (detailed)
    await this.fillDescription(details.description);

    // 5. Send SMS (if available)
    await this.checkSendSms();

    // 6 & 7. Category
    await this.selectCategory(details.category || 'General');

    // 8. Attachment (if provided)
    if (details.attachmentPath) {
      await this.uploadAttachment(details.attachmentPath);
    }

    // 9. Signature
    await this.fillSignature(details.signature || 'Principal');

    // 10. Notice Date (Current date)
    await this.selectNoticeDateCurrent();

    // 11. Validity Start Date (Current date)
    await this.selectValidityStartDate();

    // 12. Validity End Date (Current date + 7 days)
    await this.selectValidityEndDate(details.validityDays ?? 7);

    // 13. Preview and Publish
    await this.clickPreviewAndPublish();

    // 14 & 15. Choose Template
    await this.selectTemplate(details.templateName || 'Formal Template');

    // 16. Confirm and Publish
    await this.confirmAndPublish();
  }
}
