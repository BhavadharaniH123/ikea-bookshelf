import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import locators from '../locators/locators.json';
 
export class FiltersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
 
  async searchProduct(productName: string) {
    const searchInput = eval(`this.page.${locators.HomePage.searchBox}`);
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(productName);
   
 
await Promise.all([
    this.page.waitForEvent('framenavigated'),
    this.page.keyboard.press('Enter')
  ]);
 
    //  await this.page.waitForSelector('[data-testid="product-compact"]', { timeout: 5000 });
  }
 
  async openAllFilters() {
    const allFiltersButton = eval(`this.page.${locators.SearchResultsPage.allFiltersButton}`);
    await allFiltersButton.click();
    await this.page.waitForTimeout(1000);
  }
 
  async applyCategoryFilter(categories: string[]) {
    const categoryButton = eval(`this.page.${locators.SearchResultsPage.categoryButton}`);
    await categoryButton.click();
 
    for (const category of categories) {
      const checkbox = this.page.locator(`label:has-text("${category}") input[type="checkbox"]`);
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
    }
  }
 
  async applyPriceFilter(prices: string[]) {
    const priceButton = eval(`this.page.${locators.SearchResultsPage.priceButton}`);
    await priceButton.click();
 
    for (const price of prices) {
      const checkbox = this.page.locator(`label:has-text("${price}") input[type="checkbox"]`);
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
    }
  }
 
  async applyAvailabilityFilter() {
    const availabilityButton = eval(`this.page.${locators.SearchResultsPage.availabilityButton}`);
    await availabilityButton.click();
 
    const availabilityOption = eval(`this.page.${locators.SearchResultsPage.availabilityOption}`);
    if (await availabilityOption.isVisible()) {
      await availabilityOption.click();
    }
  }
 
  async applyViewButton() {
    const viewButton = eval(`this.page.${locators.SearchResultsPage.viewButton}`);
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }
 
  async printTopProducts(title: string, count: number) {
    console.log(`\n${title}`);
    
    const productCompact = eval(`this.page.${locators.SearchResultsPage.productCompact}`);
    const productNames = await productCompact.locator('.product-compact__name').allTextContents();
    const productPrices = await productCompact.locator('.product-compact__price').allTextContents();
 
    for (let i = 0; i < Math.min(count, productNames.length); i++) {
      console.log(`${i + 1}. ${productNames[i]} - ${productPrices[i]}`);
    }
  }
}