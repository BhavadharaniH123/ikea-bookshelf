import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import locators from '../locators/locators.json';

export class SearchResults extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async acceptCookies() {
    await this.page.waitForTimeout(2000);

    const cookieButton = this.page.locator('button:has-text("Ok")');
    const fallbackButton = this.page.locator('text=Accept Cookies');

    try {
      if (await cookieButton.isVisible({ timeout: 5000 })) {
        await cookieButton.click();
        console.log('Cookie accepted via button:has-text');
      } else if (await fallbackButton.isVisible({ timeout: 5000 })) {
        await fallbackButton.click();
        console.log('Cookie accepted via text=Accept Cookies');
      } else {
        console.log('Cookie button not visible');
      }
    } catch (error) {
      console.log('Cookie popup not found or already handled');
    }
  }

  async searchProduct(productName: string) {
    const searchInput = this.getLocator(locators.HomePage.searchBox);
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill(productName);

    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async openAllFilters() {
    const allFiltersButton = this.getLocator(locators.SearchResultsPage.allFiltersButton);
    console.log('Waiting for "All filters" button to be visible...');
    await allFiltersButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000);
    await allFiltersButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async applyCustomerRatingFilter() {
    console.log('Applying customer rating filter...');
    const customerRatingButton = this.getLocator(locators.SearchResultsPage.customerRatingButton);
    await customerRatingButton.waitFor({ state: 'visible', timeout: 10000 });
    await customerRatingButton.click();

    const ratingCheckbox = this.getLocator(locators.SearchResultsPage.ratingCheckbox);
    await ratingCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await ratingCheckbox.click();
  }

  async applyViewButton() {
    const viewButton = this.getLocator(locators.SearchResultsPage.viewButton);
    if (await viewButton.isVisible({ timeout: 10000 })) {
      await viewButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async printTopProducts(title: string, count: number) {
    console.log(`\n${title}`);

    const nameLocator = this.getLocator(locators.SearchResultsPage["product-compact__name"]);
    const priceLocator = this.getLocator(locators.SearchResultsPage["product-compact__price"]);

    const productNames = await nameLocator.allTextContents();
    const productPrices = await priceLocator.allTextContents();

    for (let i = 0; i < Math.min(count, productNames.length); i++) {
      console.log(`${i + 1}. ${productNames[i]} - ${productPrices[i]}`);
    }
  }
}