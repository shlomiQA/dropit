import { Locator, Page } from 'playwright/test';

export default class BasePage {
  page: Page;
  listItems: Locator;
  header: Locator;
  cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listItems = this.page.getByRole('listitem');
    this.header = this.page.locator('h1');
    this.cartIcon = this.page.locator('#cart-icon-bubble');
  }

  // this way we can reuse and save lines of code (specific functions + locators) for ecah li element e.g. tabs
  public async selectTabByName(Name: string) {
    const el = this.listItems.filter({ hasText: Name });
    await el.click();
  }

  // more generic & reusable - however it'll require different approach for handling locators instead -> we'll initalize object e.g. myLocator = {'getByLabel': 'unique text'}
  public async selectElementByName(locators: any, text: string) {
    const el = locators.filter({ hasText: text });
    await el.click();
  }

  async getPageTitle(): Promise<string | null> {
    return await this.header.textContent();
  }

  async navigateToCart() {
    await this.cartIcon.waitFor({ state: 'visible' });
    await this.cartIcon.click();
  }

  async navigateBack() {
    await this.page.goBack();
  }

  public async fillTextBoXElByName(
    elName: string,
    text: string
  ): Promise<void> {
    await this.page
      .getByRole('textbox', { name: `${elName}` })
      .waitFor({ state: 'attached' });
    await this.page.getByRole('textbox', { name: `${elName}` }).fill(text);
  }

  public async fillIframeElById(elId: string, text: string): Promise<void> {
    const iframeElement = this.page
      .locator('.card-fields-iframe')
      .first()
      .contentFrame();
    await iframeElement.locator(`#${elId}`).fill(text);
  }
}
