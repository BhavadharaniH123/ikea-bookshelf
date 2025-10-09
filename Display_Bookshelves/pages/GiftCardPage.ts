import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import locators from '../locators/locators.json';

export class GiftCardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoHomePage() {
    await this.page.goto('https://www.ikea.com/in/en/', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToGiftCard() {
    const { giftCardLink, buyGiftCardLink } = locators.GiftCardPage;

    const giftCardLocator = this.getLocator(giftCardLink);
    await giftCardLocator.waitFor({ state: 'visible', timeout: 10000 });
    await giftCardLocator.click();

    const buyGiftCardLocator = this.getLocator(buyGiftCardLink);
    await buyGiftCardLocator.waitFor({ state: 'visible', timeout: 10000 });
    await buyGiftCardLocator.click();
  }

  async acceptCookies() {
    await this.page.waitForTimeout(2000);

    const cookieButton = this.page.locator('button:has-text("Ok")');
    const fallbackButton = this.page.locator('text=Accept Cookies');

    try {
      if (await cookieButton.isVisible({ timeout: 5000 })) {
        await cookieButton.click();
        console.log(' Cookie accepted via button:has-text');
      } else if (await fallbackButton.isVisible({ timeout: 5000 })) {
        await fallbackButton.click();
        console.log(' Cookie accepted via text=Accept Cookies');
      } else {
        console.log(' Cookie button not visible');
      }
    } catch (error) {
      console.log(' Cookie popup not found or already handled');
    }
  }

  async fillGiftCardDetails(details: {
    amount: string;
    message: string;
    firstName: string;
    lastName: string;
    email: string;
    confirmEmail: string;
  }) {
    const {
      amountInput,
      messageInput,
      firstNameInput,
      lastNameInput,
      emailInput,
      confirmEmailInput
    } = locators.GiftCardPage;

    const amountLocator = this.getLocator(amountInput);
    await amountLocator.scrollIntoViewIfNeeded();
    await amountLocator.waitFor({ state: 'visible', timeout: 20000 });
    await amountLocator.fill(details.amount);

    const messageLocator = this.getLocator(messageInput);
    await messageLocator.scrollIntoViewIfNeeded();
    await messageLocator.fill(details.message);

    const firstNameLocator = this.getLocator(firstNameInput);
    await firstNameLocator.scrollIntoViewIfNeeded();
    await firstNameLocator.waitFor({ state: 'visible', timeout: 20000 });
    await firstNameLocator.fill(details.firstName);

    const lastNameLocator = this.getLocator(lastNameInput);
    await lastNameLocator.scrollIntoViewIfNeeded();
    await lastNameLocator.fill(details.lastName);

    const emailLocator = this.getLocator(emailInput);
    await emailLocator.scrollIntoViewIfNeeded();
    await emailLocator.waitFor({ state: 'visible', timeout: 20000 });
    await emailLocator.fill(details.email);

    const confirmLocator = this.getLocator(confirmEmailInput);
    await confirmLocator.scrollIntoViewIfNeeded();
    await confirmLocator.fill(details.confirmEmail);
  }

  async agreeToTerms() {
    const { termsCheckbox } = locators.GiftCardPage;
    const checkbox = this.getLocator(termsCheckbox);
    await checkbox.scrollIntoViewIfNeeded();
    if (await checkbox.isVisible()) {
      await checkbox.click();
    }
  }

  async submitGiftCardForm() {
    const { submitButton } = locators.GiftCardPage;
    const submitLocator = this.getLocator(submitButton);
    await submitLocator.scrollIntoViewIfNeeded();
    await submitLocator.click();
  }

  async validateEmailError() {
    const errorLocator = this.page.locator('.errorBox').filter({ hasText: 'Please enter a valid email' });
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
    const errorMessage = await errorLocator.innerText();
    console.log(`Error Message Captured: ${errorMessage.trim()}`);
  }
}
