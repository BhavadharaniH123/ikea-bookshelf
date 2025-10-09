import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import locators from '../locators/locators.json';

export class FiltersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async searchProduct(productName: string) {
    const searchInput = this.getLocator(locators.HomePage.searchBox);
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(productName);

    await Promise.all([
      this.page.waitForEvent('framenavigated'),
      this.page.keyboard.press('Enter')
    ]);
  }

  async openAllFilters() {
    const allFiltersButton = this.getLocator(locators.SearchResultsPage.allFiltersButton);
    await allFiltersButton.click();
    await this.page.waitForTimeout(1000);
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

  async applyCategoryFilter(categories: string[]) {
    const categoryButton = this.getLocator(locators.SearchResultsPage.categoryButton);
    await categoryButton.click();

    for (const category of categories) {
      const checkbox = this.page.locator(`label:has-text("${category}") input[type="checkbox"]`);
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
    }
  }

  async applyPriceFilter(prices: string[]) {
    const priceButton = this.getLocator(locators.SearchResultsPage.priceButton);
    await priceButton.click();

    for (const price of prices) {
      const checkbox = this.page.locator(`label:has-text("${price}") input[type="checkbox"]`);
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
    }
  }

  async applyAvailabilityFilter() {
    const availabilityButton = this.getLocator(locators.SearchResultsPage.availabilityButton);
    await availabilityButton.click();

    const availabilityOption = this.getLocator(locators.SearchResultsPage.availabilityOption.nestedLocator);
    if (await availabilityOption.isVisible()) {
      await availabilityOption.click();
    }
  }

  async applyViewButton() {
    const viewButton = this.getLocator(locators.SearchResultsPage.viewButton);
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await this.page.waitForLoadState('networkidle');
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