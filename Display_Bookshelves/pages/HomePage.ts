import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly searchBox: Locator;
  readonly okButton: Locator;
  readonly tabButtons: Locator;

 
  async acceptCookies() {

  }

  async searchProduct(product: string) {

  }
  async listTabs() {

  }

  }
  