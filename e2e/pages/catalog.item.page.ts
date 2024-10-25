import { Locator, Page } from 'playwright/test';
import BasePage from './base.page.ts';

export default class ItemPage extends BasePage {
  itemTitle: Locator;
  sizes: Locator;
  addToCartButton: Locator;
  addedToCartMessage: Locator;
  continueShoppingButton: Locator;
  quantityField: Locator;

  constructor(page: Page) {
    super(page);
    this.itemTitle = this.page.locator('h1.product__title');
    this.sizes = this.page.locator('label');

    this.addToCartButton = this.page.getByRole('button', { name: 'add' });
    this.addedToCartMessage = this.page.getByRole('heading', {
      name: 'Item added to your cart',
    });
    this.continueShoppingButton = this.page
      .getByRole('button')
      .filter({ hasText: 'Continue' }); // see comment in base page line 20

    this.quantityField = this.page.getByRole('spinbutton', {
      name: 'Quantity',
    });
  }

  async isTitleShown(title: string): Promise<boolean> {
    await this.itemTitle.waitFor({ state: 'visible' });
    const itemPageTitle = await this.itemTitle.textContent();
    return itemPageTitle?.trim() === title;
  }

  async selectSize(sizeName: string): Promise<void> {
    await this.selectElementByName(this.sizes, sizeName);
  }

  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityField.waitFor({ state: 'attached' });
    await this.quantityField.click();
    await this.quantityField.fill(quantity);
  }

  async addItemToCart(): Promise<void> {
    try {
      await this.addToCartButton.waitFor({ state: 'attached' });
      await this.addToCartButton.click();
    } catch (err) {
      throw `item was sold out, please choose an available item or ${err}`;
    }
  }

  async isItemAdded(): Promise<boolean> {
    await this.addedToCartMessage.waitFor({ state: 'visible' });
    return await this.addedToCartMessage.isVisible();
  }

  async continueShoppingSameItem(
    size: string,
    quantity: string
  ): Promise<void> {
    await this.continueShoppingButton.waitFor({ state: 'attached' });
    await this.continueShoppingButton.click();
    await this.addedToCartMessage.waitFor({ state: 'hidden' });
    await this.selectSize(size);
    await this.fillQuantity(quantity);
  }

  async getAmountUponCartIcon() {
    return await this.cartIcon.textContent();
  }

  // less cleaner:
  //   async selectSize(sizeName: string) {
  //     const allSizes = await this.sizes.all();
  //     for (const size of allSizes) {
  //       if ((await size.textContent())?.includes(sizeName)) {
  //         await size.click();
  //         break;
  //       }
  //     }
  //   }
}
