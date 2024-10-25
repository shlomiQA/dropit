import { Locator, Page } from 'playwright/test';
import BasePage from './base.page.ts';

export default class CartPage extends BasePage {
  subTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.subTotal = this.page.locator('.totals > p');
  }

  async getSubTotalPrice() {
    await this.subTotal.waitFor({ state: 'visible' });
    return await this.subTotal.textContent();
  }
}
