import { Locator, Page } from 'playwright/test';

export default class LoginPage {
  page: Page;
  passwordField: Locator;
  subscribeButton: Locator;
  shopifySection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordField = this.page.locator('#password');
    this.subscribeButton = this.page.getByRole('button', { name: 'Enter' });
    this.shopifySection = this.page.getByRole('region');
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clicksubscribeButton(): Promise<void> {
    await this.subscribeButton.click();
  }

  async getPageTitle(): Promise<string | null> {
    await this.shopifySection.waitFor({ state: 'visible' });
    return await this.shopifySection.textContent();
  }
}
