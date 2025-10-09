// fixtures/page-fixtures.ts
import { test as baseTest, expect } from '@playwright/test';
import { readCSVData } from '../utils/readCSV';
import { HomePage } from '../pages/HomePage';
import { SearchResults } from '../pages/SearchResults';
import { GiftCardPage } from '../pages/GiftCardPage';
import { CartPage } from '../pages/CartPage';
import { FiltersPage } from '../pages/FiltersPage';

type TestData = {
  category: string;
  field: string;
  value: string;
};

class PageFixture {
  readonly homePage: HomePage;
  readonly searchResultsPage: SearchResults;
  readonly giftCardPage: GiftCardPage;
  readonly cartPage: CartPage;
  readonly FiltersPage: FiltersPage;

  constructor(page) {
    this.homePage = new HomePage(page);
    this.searchResultsPage = new SearchResults(page);
    this.giftCardPage = new GiftCardPage(page);
    this.cartPage = new CartPage(page);
    this.FiltersPage = new FiltersPage(page);
  }
}

type Fixtures = {
  pages: PageFixture;
  testData: TestData[];
};

export const test = baseTest.extend<Fixtures>({
  pages: async ({ page }, use) => {
    await use(new PageFixture(page));
  },
  testData: async ({}, use) => {
    const data = readCSVData() as TestData[];
    await use(data);
  },
});

export { expect };