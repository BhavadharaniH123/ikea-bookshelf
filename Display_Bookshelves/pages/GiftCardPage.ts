import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GiftCardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}