import { expect, Locator, Page } from '@playwright/test';

export interface LeaveTypeDetails {
  leaveType: string;
  leavesCountPerYear: number;
  carryForward: 'Yes' | 'No';
  isPaid: boolean;
}

export interface ApplyLeaveDetails {
  category: string;
  employee: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachmentPath: string;
}

export class AddLeavePage {
  readonly page: Page;
  readonly manageNavLink: Locator;
  readonly leaveModuleCard: Locator;
  readonly leavePolicyTab: Locator;
  readonly applyLeaveTab: Locator;
  readonly addLeaveTypeButton: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly leavesCountPerYearInput: Locator;
  readonly carryForwardDropdown: Locator;
  readonly paidYesRadio: Locator;
  readonly paidNoRadio: Locator;
  readonly addLeaveButton: Locator;
  readonly categoryDropdown: Locator;
  readonly employeeDropdown: Locator;
  readonly applyLeaveTypeDropdown: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly reasonTextarea: Locator;
  readonly attachmentInput: Locator;
  readonly applyLeaveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manageNavLink = page.locator('a[routerlink="/school-management"], a:has-text("Manage")').first();
    this.leaveModuleCard = page.locator('div.card:has(h3:text-is("Leave")), h3:text-is("Leave")').first();
    this.leavePolicyTab = page.locator('div.screen-tab:has-text("Leave policy"), [routerlink="/school-management/leave/leave-policy"]').first();
    this.applyLeaveTab = page.locator('div.screen-tab:has-text("Apply leave"), [routerlink="/school-management/leave/apply-leave"]').first();
    this.addLeaveTypeButton = page.getByRole('button', { name: 'Add Leave Type', exact: true });
    this.leaveTypeDropdown = page.locator('p-select[formcontrolname="leaveType"]');
    this.leavesCountPerYearInput = page.locator('input[formcontrolname="leavesCountPerYear"]');
    this.carryForwardDropdown = page.locator('p-select[formcontrolname="carryForward"]');
    const addLeaveDialog = page.getByRole('dialog', { name: 'Add leave type' });
    this.paidYesRadio = addLeaveDialog.getByText('Yes', { exact: true });
    this.paidNoRadio = addLeaveDialog.getByText('No', { exact: true });
    this.addLeaveButton = page.getByRole('button', { name: 'Add Leave', exact: true });
    this.categoryDropdown = page.locator('p-select[formcontrolname="category"]');
    this.employeeDropdown = page.locator('p-select[formcontrolname="employee"], p-select[formcontrolname="employeeId"], p-select[formcontrolname="user"]').first();
    this.applyLeaveTypeDropdown = page.locator('p-select[formcontrolname="leaveType"]');
    this.startDateInput = page.locator('p-datepicker[formcontrolname="startDate"] input');
    this.endDateInput = page.locator('p-datepicker[formcontrolname="endDate"] input');
    this.reasonTextarea = page.locator('textarea[formcontrolname="reason"]');
    this.attachmentInput = page.locator('input[type="file"]').first();
    this.applyLeaveButton = page.getByRole('button', { name: 'Apply leave', exact: true });
  }

  async navigateToLeavePolicy() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.leaveModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.leaveModuleCard.click();
    await this.leavePolicyTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.leavePolicyTab.click();
  }

  async openAddLeaveType() {
    await this.addLeaveTypeButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addLeaveTypeButton.click();
  }

  async selectDropdownOption(dropdown: Locator, optionText: string) {
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();
    const listbox = this.page.locator('ul[role="listbox"]:visible').last();
    await listbox.waitFor({ state: 'visible', timeout: 5000 });
    const option = listbox.getByRole('option', { name: optionText, exact: true });

    if (await option.count()) {
      await option.first().scrollIntoViewIfNeeded();
      await option.first().click();
      return;
    }

    // PrimeNG may render a long list progressively; move the focused option down until the target appears.
    for (let index = 0; index < 100; index++) {
      await this.page.keyboard.press('ArrowDown');
      if (await option.count()) {
        await option.first().scrollIntoViewIfNeeded();
        await option.first().click();
        return;
      }
    }

    throw new Error(`Dropdown option not found: ${optionText}`);
  }

  async fillLeaveType(details: LeaveTypeDetails) {
    await this.selectDropdownOption(this.leaveTypeDropdown, details.leaveType);
    await this.leavesCountPerYearInput.fill(String(details.leavesCountPerYear));
    await this.selectDropdownOption(this.carryForwardDropdown, details.carryForward);
    await (details.isPaid ? this.paidYesRadio : this.paidNoRadio).click();
  }

  async addLeave() {
    await expect(this.addLeaveButton).toBeEnabled();
    await this.addLeaveButton.click();
  }

  async navigateToApplyLeave() {
    await this.manageNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.manageNavLink.click();
    await this.leaveModuleCard.waitFor({ state: 'visible', timeout: 20000 });
    await this.leaveModuleCard.click();
    await this.applyLeaveTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.applyLeaveTab.click();
  }

  async fillApplyLeave(details: ApplyLeaveDetails) {
    await this.selectDropdownOption(this.categoryDropdown, details.category);

    await this.employeeDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.selectDropdownOption(this.employeeDropdown, details.employee);

    await this.applyLeaveTypeDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.selectDropdownOption(this.applyLeaveTypeDropdown, details.leaveType);

    await this.startDateInput.fill(details.startDate);
    await this.startDateInput.press('Enter');
    await this.endDateInput.fill(details.endDate);
    await this.endDateInput.press('Enter');
    await this.reasonTextarea.fill(details.reason);
    await this.attachmentInput.setInputFiles(details.attachmentPath);
  }

  async applyLeave() {
    await expect(this.applyLeaveButton).toBeEnabled();
    await this.applyLeaveButton.click();
  }
}