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
    await this.page.waitForTimeout(2000);
  }

  
async applyCategoryFilter() {
  console.log('Applying category filter...');
  const categoryButton = this.getLocator(locators.SearchResultsPage.categoryButton);
  await categoryButton.waitFor({ state: 'visible', timeout: 10000 });
  await categoryButton.click();

  const storageSolutionButton = this.getLocator(locators.SearchResultsPage.storageSolutionButton);
  await storageSolutionButton.waitFor({ state: 'visible', timeout: 10000 });
  await storageSolutionButton.click();

  const omarSystemButton = this.getLocator(locators.SearchResultsPage.omarSystemButton);
  await omarSystemButton.waitFor({ state: 'visible', timeout: 10000 });
  await omarSystemButton.click();

  const omarCombinationsButton = this.getLocator(locators.SearchResultsPage.omarCombinationsButton);
  await omarCombinationsButton.waitFor({ state: 'visible', timeout: 10000 });
  await omarCombinationsButton.click();
}

  async applyPriceFilter() {
  console.log('Applying price filter...');
  const priceButton = this.getLocator(locators.SearchResultsPage.priceButton);
  await priceButton.waitFor({ state: 'visible', timeout: 10000 });
  await priceButton.click();

  const priceRange0 = this.getLocator(locators.SearchResultsPage.priceRange0);
  await priceRange0.waitFor({ state: 'visible', timeout: 10000 });
  await priceRange0.click();

  const priceRange5000 = this.getLocator(locators.SearchResultsPage.priceRange5000);
  await priceRange5000.waitFor({ state: 'visible', timeout: 10000 });
  await priceRange5000.click();

  const priceRange10000 = this.getLocator(locators.SearchResultsPage.priceRange10000);
  await priceRange10000.waitFor({ state: 'visible', timeout: 10000 });
  await priceRange10000.click();
}

 async applyAvailabilityFilter() {
  console.log('Applying availability filter...');
  const availabilityButton = this.getLocator(locators.SearchResultsPage.availabilityButton);
  await availabilityButton.waitFor({ state: 'visible', timeout: 10000 });
  await availabilityButton.click();

  const availabilityGroup = this.page.getByRole('group', { name: 'Availability' });
  const optionSpan = availabilityGroup.locator('span').nth(4);
  await optionSpan.waitFor({ state: 'visible', timeout: 10000 });
  await optionSpan.click();
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