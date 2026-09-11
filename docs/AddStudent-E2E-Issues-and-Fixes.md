# Add Student E2E Testing: Issues and Fixes

## Purpose

This document records the issues found while automating the Add Student flow with Playwright. The same patterns can be reused in other modules that use Angular reactive forms, PrimeNG dropdowns, date pickers, file uploads, and confirmation dialogs.

## Application Flow

1. Login
2. Open Student module
3. Open Add Student
4. Complete Personal Information
5. Complete Academic Information
6. Complete Address Information
7. Complete Guardian Information
8. Click the form-level `Add Student` button
9. Click `Confirm & Add` in the preview popup
10. Verify the success toast

## Issue 1: Duplicate option locator

### Symptom

Playwright reported a strict mode violation for `Delhi` because two options matched:

```text
getByRole('option', { name: 'Delhi', exact: true }) resolved to 2 elements
```

### Root cause

The option was searched globally across the page. PrimeNG keeps options from more than one dropdown in the DOM, so State and City could both expose a `Delhi` option.

### Fix

Scope the option to the listbox belonging to the currently opened combobox. PrimeNG exposes the listbox ID through `aria-controls`.

```ts
const listboxId = await combobox.getAttribute('aria-controls');
const activeListbox = listboxId
  ? page.locator(`#${listboxId}`)
  : page.locator('ul[role="listbox"]:visible').last();

const option = activeListbox.getByRole('option', {
  name: optionText,
  exact: true,
});

await option.first().click();
```

### Reusable rule

Never use a global option locator when more than one PrimeNG dropdown can contain the same label. Scope the option to its active listbox.

## Issue 2: State, City, or Section dropdown opened intermittently

### Symptom

The test sometimes clicked the dropdown but the list did not appear. Manual clicking worked.

### Root cause

The dropdown data was loaded asynchronously, and the click could happen during a PrimeNG animation or before the API response populated the options.

### Fix

Put the click inside the retry block. Only click when the combobox is not already expanded, then wait for the associated listbox and requested option.

```ts
while (Date.now() < deadline) {
  try {
    if (await combobox.getAttribute('aria-expanded') !== 'true') {
      await combobox.click({ timeout: 1000 });
    }

    const listboxId = await combobox.getAttribute('aria-controls');
    const listbox = listboxId
      ? page.locator(`#${listboxId}`)
      : page.locator('ul[role="listbox"]:visible').last();

    await listbox.waitFor({ state: 'visible', timeout: 1000 });
    const option = listbox.getByRole('option', {
      name: optionText,
      exact: true,
    });
    await option.first().waitFor({ state: 'visible', timeout: 1000 });
    await option.first().click();
    return;
  } catch {
    if (!page.isClosed()) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(250);
    }
  }
}
```

The helper uses a bounded 30-second operation timeout. It does not retry forever.

## Issue 3: Filterable dropdown selected the wrong option

### Symptom

Country, State, or City selection could match an option from another open dropdown.

### Root cause

The filter input and option were selected globally:

```ts
page.locator('input.p-select-filter').last();
page.getByRole('option', { name: optionText });
```

### Fix

Find the active listbox first, then locate its filter input and option relative to that listbox.

```ts
const filterInput = listbox.locator(
  'xpath=preceding::input[contains(@class, "p-select-filter")]'
).last();

await filterInput.fill(optionText);
const option = listbox.getByRole('option', {
  name: optionText,
  exact: true,
});
await option.first().click();
```

## Issue 4: `keyboard.press` failed because the page closed

### Symptom

```text
Error: keyboard.press: Target page, context or browser has been closed
```

The error occurred in the retry cleanup code while pressing `Escape`.

### Root cause

The page or test context had already closed, but the catch block still attempted to use the keyboard.

### Fix

Guard all cleanup actions:

```ts
if (!page.isClosed()) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
}
```

## Issue 5: Final confirmation button was not clicked

### Symptom

The test waited for `Confirm & Add`, but the button never appeared.

### Root cause

The flow has two different buttons:

1. `Add Student` at the bottom of the Guardian form
2. `Confirm & Add` inside the preview popup

The first button must be clicked before the second one is rendered.

### Fix

Keep separate locators and use this order:

```ts
await reviewAddStudentButton.waitFor({ state: 'visible', timeout: 30000 });
await reviewAddStudentButton.scrollIntoViewIfNeeded();
await reviewAddStudentButton.click({ timeout: 30000 });

await submitButton.waitFor({ state: 'visible', timeout: 30000 });
await submitButton.scrollIntoViewIfNeeded();
await submitButton.click({ timeout: 30000 });
```

Recommended locators:

```ts
reviewAddStudentButton = page
  .getByRole('button', { name: 'Add Student', exact: true })
  .last();

submitButton = page.getByRole('button', {
  name: 'Confirm & Add',
  exact: true,
});
```

## Issue 6: Preview popup did not open because validation failed

### Symptom

The Guardian form `Add Student` button was clicked, but `Confirm & Add` did not appear.

### Root cause

The form was invalid. The error snapshot showed validation messages such as:

```text
Email is required
Enter valid 12-digit Aadhaar
```

When the form is invalid, `openPreview()` returns without showing the dialog.

### Fixes

Commit fields before submitting, especially fields with custom validation:

```ts
await guardianPhoneInput.fill(phone);
await guardianPhoneInput.press('Tab');

await guardianEmailInput.waitFor({ state: 'visible', timeout: 30000 });
await guardianEmailInput.fill(email);
await guardianEmailInput.press('Tab');

if (await guardianEmailInput.inputValue() !== email) {
  await guardianEmailInput.fill(email);
  await guardianEmailInput.press('Tab');
}
```

Always inspect the page snapshot when a popup is missing. A missing popup often means validation prevented the click handler from opening it.

## Issue 7: Generated Aadhaar number failed validation

### Symptom

The generated document number looked like a valid 12-digit number but the form rejected it.

### Root cause

The application rule rejects Aadhaar values that start with `0` or `1`. The generator could create a number beginning with `1`.

### Fix

Generate a first digit from `2` to `9` and then append eleven more digits:

```ts
static documentNumber(): string {
  const firstDigit = Math.floor(2 + Math.random() * 8).toString();
  const remainingDigits = `${uniqueSuffix()}${Math.floor(1000 + Math.random() * 8999)}`;
  return `${firstDigit}${remainingDigits}`.slice(0, 12);
}
```

## Issue 8: Incorrect URL assertion after successful add

### Symptom

The success toast appeared, but this assertion timed out:

```ts
await expect(page).toHaveURL(/student\/list/);
```

The actual URL remained `/student/add`.

### Root cause

The application confirms success with a toast but does not navigate to the student list immediately.

### Fix

Use the actual application behavior as the success assertion:

```ts
await expect(
  page.getByText('Student added successfully', { exact: true })
).toBeVisible();
```

Do not assert navigation unless the application actually navigates.

## Issue 9: Datepicker decade navigation used stale or incomplete UI state

### Symptom

The test sometimes had to click the forward decade button manually after clicking `Previous Decade`.

### Root cause

The test read year values while PrimeNG was still animating the datepicker panel. The loop could read stale values and make an incorrect next decision.

### Fix

Wait for the navigation button to be visible and allow the datepicker animation to settle after each click:

```ts
const previousButton = page.getByRole('button', {
  name: 'Previous Decade',
});

await previousButton.waitFor({ state: 'visible', timeout: 1000 });
await previousButton.click({ timeout: 3000 });
await page.waitForTimeout(500);
```

Then re-read the visible year range before deciding whether another click is needed. The current helper uses a bounded maximum of 14 attempts.

## Issue 10: Test timeout prevented all scenarios from running

### Symptom

The suite showed a test timeout such as:

```text
Test timeout of 120000ms exceeded
```

### Root cause

The full flow contains API waits, file uploads, datepicker navigation, popup waits, and a manual browser wait. The configured test timeout was shorter than the real flow.

### Current handling

The scenario suite uses a suite-level unlimited test timeout:

```ts
test.describe.configure({ mode: 'serial' });
test.setTimeout(0);
```

### Important note

Unlimited timeout prevents Playwright from stopping a slow test, but it can also hide a genuine hang. For CI, a bounded timeout is safer. Prefer fixing the specific wait and using a realistic timeout after the flow is stable.

## Issue 11: Serial suite stopped before remaining scenarios

### Symptom

One positive scenario failed and many later scenarios showed as not run.

### Root cause

The scenario suite was configured as serial. A failure in a serial suite stops dependent tests from running.

### Options

For independent tests, remove serial mode:

```ts
// Remove this when tests do not share state:
// test.describe.configure({ mode: 'serial' });
```

For tests that create real students in the same account, serial mode may be intentional. In that case, run a single scenario while debugging, then run the full suite after the first failure is fixed.

## Validation Messages Covered

The current HTML contains validation messages for:

### Personal Information

- Please enter first name
- Please enter a valid email address
- Please enter email address
- Enter a valid Indian mobile number (starting with 6, 7, 8, or 9)
- Please select gender
- Please choose Date of birth
- Student must be at least 3 years old for admission
- Please select category
- Please upload profile image
- Please upload birth certificate

### Academic Information

- Please select admission date
- Admission date must be after date of birth
- Please select class
- Please select section
- Last class is required
- Board roll number is required
- Previous school name is required
- Migration/transfer certificate is required
- Last class report card is required

### Address Information

- Please select country
- Please select state
- Please enter pincode
- Please enter a valid 6 digit pincode
- Please enter address

### Guardian Information

- Relation type is required
- First name is required for the primary guardian
- Phone is required for the primary guardian
- Phone is required
- Enter a valid Indian mobile number (starting with 6, 7, 8, or 9)
- Email is required
- Enter a valid email address
- Verification document is required
- Document number is required
- Enter valid 12-digit Aadhaar (cannot start with 0 or 1)
- Enter valid PAN (e.g. ABCDE1234F)
- Enter valid Voter ID (e.g. ABC1234567)
- Enter a valid DL number
- Please upload selected document (front)
- Please upload selected document (back)
- Either phone number or email is required

## Assertion Patterns

### Positive validation

For valid data, assert that no visible validation message remains after completing a step:

```ts
await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
```

### Negative validation

Assert the exact expected message and allow other validation messages to exist:

```ts
await expect(
  page.locator('.ValidationErrMsg:visible').filter({
    hasText: 'Please enter pincode',
  })
).toHaveCount(1);
```

### Success

Assert the actual success toast:

```ts
await expect(
  page.getByText('Student added successfully', { exact: true })
).toBeVisible();
```

## Debugging Checklist for Future Modules

1. Capture the exact failing page snapshot.
2. Check whether the expected popup is absent because form validation blocked it.
3. Avoid global `getByRole('option')` locators.
4. Use `aria-controls` to scope PrimeNG options to the active listbox.
5. Wait for API-backed dropdown options, not only for the dropdown container.
6. Keep click operations inside retry logic when UI animation can interfere.
7. Guard cleanup actions with `page.isClosed()`.
8. Confirm generated test data satisfies the application's custom validators.
9. Distinguish form-level buttons from popup buttons with separate locators.
10. Assert the actual success toast or response behavior instead of assuming a route change.
11. Use descriptive test titles so Playwright reports identify the failed scenario.
12. Run type checking before the full browser suite.
13. Run one focused scenario before running all scenarios.
14. Do not use an unlimited timeout permanently in CI unless there is a strong reason.

## Files Involved

- `pages/AddStudentPage.ts`: page object, locators, dropdown/datepicker helpers, submit sequence
- `utils/DataGenerator.ts`: generated email, phone, and document data
- `tests/Addstudent.spec.ts`: primary positive flow
- `tests/AddstudentScenarios.spec.ts`: positive and negative scenario suite     
      