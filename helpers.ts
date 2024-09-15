import { Page } from 'playwright/test';

export default class Helpers {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async getItemStyle(selector: string) {
    return await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element
        ? getComputedStyle(element).textDecoration.includes('line-through')
        : null;
    }, selector);
  }
}
