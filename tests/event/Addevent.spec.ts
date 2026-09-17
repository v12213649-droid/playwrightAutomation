import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { AddEventPage } from '../../pages/event/AddEventPage';
import { DataGenerator } from '../../utils/DataGenerator';

import { LOGIN_EMAIL, LOGIN_PASSWORD } from '../auth';


test.describe('Event Module - Add Event', () => {
  test('should create a new event with dates in next month selected in incremental order', async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const eventPage = new AddEventPage(page);

    // ==========================================
    // 0. Login with authorized credentials
    // ==========================================
    await loginPage.goto();
    await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
    await page.waitForURL('**/dashboard', { timeout: 30000 });

    // ==========================================
    // 1. Element 1: Event card on Manage dashboard
    // ==========================================
    console.log('Step 1: Navigating to Event module...');
    await eventPage.navigateToEventModule();
    await expect(page).toHaveURL(/.*school-management\/event/);

    // ==========================================
    // 2. Element 2: <button routerlink="/school-management/event/add-event" class="add-btn">Add Event</button>
    // ==========================================
    console.log('Step 2: Clicking Add Event button...');
    await eventPage.clickAddEvent();
    await expect(page).toHaveURL(/.*school-management\/event\/add-event/);

    // ==========================================
    // Generate realistic, unique event data to avoid duplicates
    // ==========================================
    const eventTitle = DataGenerator.eventTitle();
    const eventDescription = DataGenerator.eventDescription(eventTitle);
    const eventVenue = DataGenerator.eventVenue();
    const eventPosterPath = DataGenerator.randomJpgImage('event-poster');

    console.log(`Creating Unique Event: "${eventTitle}"`);
    console.log(`Venue: "${eventVenue}"`);

    // ==========================================
    // 3. Element 3: Target Audience dropdown (Select any one option)
    // ==========================================
    console.log('Step 3: Selecting Target Audience (Everyone (Whole School))...');
    await eventPage.selectTargetAudience('Everyone (Whole School)');

    // ==========================================
    // 4 & 5. Elements 4 & 5: Checkboxes (SMS / Email notification)
    // ==========================================
    console.log('Steps 4 & 5: Checking notification preferences...');
    await eventPage.toggleNotifications();

    // ==========================================
    // 6. Element 6: Event Type (Category) dropdown
    // ==========================================
    console.log('Step 6: Selecting Event Category (Sports)...');
    await eventPage.selectEventType('Sports');

    // Fill event name/title
    console.log(`Step 6b: Entering unique event title: "${eventTitle}"...`);
    await eventPage.fillEventName(eventTitle);

    // ==========================================
    // 7. Element 7: Description textarea
    // ==========================================
    console.log('Step 7: Entering event description...');
    await eventPage.fillDescription(eventDescription);
    await expect(eventPage.descriptionTextarea).toHaveValue(eventDescription);

    // ==========================================
    // 8. Element 8: File Upload input
    // ==========================================
    console.log(`Step 8: Uploading event poster (${eventPosterPath})...`);
    await eventPage.uploadAttachment(eventPosterPath);

    // ==========================================
    // Generate dates in next month in incremental order (startDay < endDay)
    // ==========================================
    const { startDay, endDay } = DataGenerator.nextMonthEventDates();

    // ==========================================
    // 9. Element 9: Start Date (in next month)
    // ==========================================
    console.log(`Step 9: Selecting Start Date in next month (Day ${startDay})...`);
    await eventPage.selectStartDateInNextMonth(startDay);
    await expect(eventPage.startDateInput).not.toHaveValue('');

    // ==========================================
    // 10. Element 10: End Date (in next month, in increment order)
    // ==========================================
    console.log(`Step 10: Selecting End Date in next month in increment order (Day ${endDay})...`);
    await eventPage.selectEndDateInNextMonth(endDay);
    await expect(eventPage.endDateInput).not.toHaveValue('');

    // ==========================================
    // 11. Element 11: Venue / Location
    // ==========================================
    console.log(`Step 11: Entering event venue: "${eventVenue}"...`);
    await eventPage.fillVenue(eventVenue);
    await expect(eventPage.venueInput).toHaveValue(eventVenue);

    // ==========================================
    // 12 & 13. Elements 12 & 13: Event Status (Published)
    // ==========================================
    console.log('Step 12 & 13: Setting Event Status to "published"...');
    await eventPage.selectEventStatus('published');
    await expect(eventPage.eventStatusSelect).toHaveValue('published');

    // ==========================================
    // 14 & 15. Elements 14 & 15: Time-based checkbox
    // ==========================================
    console.log('Steps 14 & 15: Checking time-based option...');
    await eventPage.toggleTimeBased(false);

    // ==========================================
    // 18. Element 18: Add Event Submit Button
    // ==========================================
    console.log('Step 18: Submitting Add Event form...');
    await eventPage.submit();

    // Verify submission outcome
    await expect(page.locator('.ValidationErrMsg:visible')).toHaveCount(0);
    await page.waitForTimeout(2000);
    console.log(`Event successfully published: "${eventTitle}"`);
  });
});

