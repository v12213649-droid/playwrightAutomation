import { expect, Locator, Page } from '@playwright/test';

export interface CertificateDetails {
  templateName: string;
  certificateType: string;
  title: string;
  className: string;
  section: string;
  studentName: string;
  issueDate: Date;
  reason: string;
}

export class AddCertificatePage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly certificateCard: Locator;
  readonly addCertificateButton: Locator;
  readonly changeTemplateButton: Locator;
  readonly certificateTypeDropdown: Locator;
  readonly titleInput: Locator;
  readonly classDropdown: Locator;
  readonly sectionDropdown: Locator;
  readonly studentDropdown: Locator;
  readonly issueDatePicker: Locator;
  readonly reasonTextarea: Locator;
  readonly generateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.certificateCard = page.locator('div.card:has(h3:text-is("Certificate")), h3:text-is("Certificate")').first();
    this.addCertificateButton = page.locator('button[routerlink*="certificate/add"], button:has-text("Add Certificate")').first();
    this.changeTemplateButton = page.getByRole('button', { name: 'Change Template', exact: true });
    this.certificateTypeDropdown = page.locator('p-select[formcontrolname="template"]');
    this.titleInput = page.locator('input[formcontrolname="title"]');
    this.classDropdown = page.locator('p-select[formcontrolname="class"]');
    this.sectionDropdown = page.locator('p-select[formcontrolname="section"]');
    this.studentDropdown = page.locator('p-select[formcontrolname="student"]');
    this.issueDatePicker = page.locator('p-datepicker[formcontrolname="issueDate"]');
    this.reasonTextarea = page.locator('textarea[formcontrolname="remark"]');
    this.generateButton = page.locator('button.gen-certificate').filter({ hasText: 'Generate Certificate' }).first();
  }

  private async selectOption(dropdown: Locator, value: string, fallbackToFirst = false) {
    const trigger = dropdown.locator('[role="combobox"], .p-select-label, .p-select-dropdown').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible, .p-select-list:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 10000 });
    const option = listbox.getByRole('option', { name: value, exact: true }).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.scrollIntoViewIfNeeded();
      await option.click();
      return;
    }

    if (fallbackToFirst) {
      const firstOption = listbox.locator('li[role="option"]').first();
      await firstOption.waitFor({ state: 'visible', timeout: 10000 });
      await firstOption.scrollIntoViewIfNeeded();
      await firstOption.click();
      return;
    }

    throw new Error(`Certificate option "${value}" was not found.`);
  }

  private async selectDate(date: Date) {
    const input = this.issueDatePicker.locator('input').first();
    await this.issueDatePicker.locator('button[aria-label="Choose Date"]').click();
    await this.page.waitForTimeout(300);
    const day = String(date.getDate());
    const cell = this.page.locator(`.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${day}")`).first();
    await cell.waitFor({ state: 'visible', timeout: 10000 });
    await cell.click();
    await expect(input).not.toHaveValue('');
  }

  private async selectTemplate(templateName: string) {
    if (await this.changeTemplateButton.isVisible({ timeout: 1500 }).catch(() => false)) {
      await this.changeTemplateButton.click();
      await this.page.waitForTimeout(500);
    }

    const template = this.page.getByText(templateName, { exact: true }).last();
    if (await template.isVisible({ timeout: 5000 }).catch(() => false)) {
      await template.click();
      return;
    }

    const firstTemplate = this.page.locator('[class*="template"]:visible').filter({ has: this.page.locator('img') }).first();
    await firstTemplate.waitFor({ state: 'visible', timeout: 10000 });
    await firstTemplate.click();
  }

  async navigateToAddCertificate() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.page.waitForTimeout(500);
    await this.certificateCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.certificateCard.click();
    await this.page.waitForTimeout(700);
    await this.addCertificateButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addCertificateButton.click();
    await this.page.waitForTimeout(700);
  }

  async generateCertificate(details: CertificateDetails) {
    await this.navigateToAddCertificate();
    await this.selectTemplate(details.templateName);
    await this.selectOption(this.certificateTypeDropdown, details.certificateType, true);
    await this.titleInput.fill(details.title);
    await this.selectOption(this.classDropdown, details.className);
    await this.selectOption(this.sectionDropdown, details.section);
    await this.selectOption(this.studentDropdown, details.studentName, true);
    await this.selectDate(details.issueDate);
    await this.reasonTextarea.fill(details.reason);
    await this.generateButton.scrollIntoViewIfNeeded();
    await this.generateButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.generateButton).toBeEnabled();
    await this.generateButton.click();
    await this.page.waitForTimeout(1500);
  }
}