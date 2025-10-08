import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import locators from '../locators/locators.json';

function resolveLocator(page: Page, locatorStr: string) {
  try {
    const locator = eval(`page.${locatorStr}`);
    if (!locator || typeof locator !== 'object' || typeof locator['click'] !== 'function') {
      throw new Error(`Invalid locator: ${locatorStr}`);
    }
    return locator;
  } catch (error) {
    throw new Error(`Failed to resolve locator: ${locatorStr}\nError: ${error}`);
  }
}

export class SearchResults extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  
  async acceptCookies() {
    await this.page.waitForTimeout(2000);

    const cookieButton = this.page.locator('button:has-text("Accept")');
    const fallbackButton = this.page.locator('text=Accept Cookies');

    try {
      if (await cookieButton.isVisible({ timeout: 5000 })) {
        await cookieButton.click();
        console.log('✅ Cookie accepted via button:has-text');
      } else if (await fallbackButton.isVisible({ timeout: 5000 })) {
        await fallbackButton.click();
        console.log('✅ Cookie accepted via text=Accept Cookies');
      } else {
        console.log('⚠️ Cookie button not visible');
      }
    } catch (error) {
      console.log('⚠️ Cookie popup not found or already handled');
    }
  }

  async searchProduct(productName: string) {
    const searchInput = resolveLocator(this.page, locators.HomePage.searchBox);
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill(productName);

    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded'); // More reliable than 'load'
    await this.page.waitForTimeout(1500); // Buffer for rendering in Firefox/WebKit
  }

  async openAllFilters() {
    const allFiltersButton = resolveLocator(this.page, locators.SearchResultsPage.allFiltersButton);
    console.log('🔍 Waiting for "All filters" button to be visible...');
    await allFiltersButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000); // Buffer for rendering
    await allFiltersButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async applyCustomerRatingFilter() {
    console.log('⭐ Applying customer rating filter...');
    const customerRatingButton = resolveLocator(this.page, locators.SearchResultsPage.customerRatingButton);
    await customerRatingButton.waitFor({ state: 'visible', timeout: 10000 });
    await customerRatingButton.click();

    const ratingCheckbox = resolveLocator(this.page, locators.SearchResultsPage.ratingCheckbox);
    await ratingCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await ratingCheckbox.click();
  }

  async applyViewButton() {
    const viewButton = resolveLocator(this.page, locators.SearchResultsPage.viewButton);
    if (await viewButton.isVisible({ timeout: 10000 })) {
      await viewButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async printTopProducts(title: string, count: number) {
    console.log(`\n${title}`);

    const nameLocator = this.page.locator(`xpath=${locators.SearchResultsPage["product-compact__name"]}`);
    const priceLocator = this.page.locator(`xpath=${locators.SearchResultsPage["product-compact__price"]}`);

    const productNames = await nameLocator.allTextContents();
    const productPrices = await priceLocator.allTextContents();

    for (let i = 0; i < Math.min(count, productNames.length); i++) {
      console.log(`${i + 1}. ${productNames[i]} - ${productPrices[i]}`);
    }
  }
}