import { Locator, Page } from 'playwright/test';
import BasePage from './base.page.ts';

export default class CheckoutPage extends BasePage {
  checkoutButton: Locator;
  contactTitle: Locator;
  totalPrice: Locator;
  calculatingText: Locator;
  lastNameField: Locator;
  addressField: Locator;
  cityField: Locator;
  cardNumber: Locator;
  expirationDate: Locator;
  nameOnCard: Locator;
  payNowButton: Locator;
  confiramtionMessage: Locator;
  emailMessage: Locator;
  cardMessage: Locator;
  paymentErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = this.page.getByRole('button', { name: 'Check out' });
    this.contactTitle = this.page
      .getByRole('heading')
      .filter({ hasText: 'Contact' });
    this.totalPrice = this.page.locator('strong');
    this.calculatingText = this.page
      .getByRole('cell')
      .filter({ hasText: 'Calculating…' });
    this.payNowButton = this.page.locator('#checkout-pay-button');
    this.confiramtionMessage = this.page.getByRole('heading', {
      name: 'Thank you!',
    });
    this.emailMessage = this.page.locator('#error-for-email');
    this.cardMessage = this.page.locator('#error-for-number');
    this.paymentErrorMessage = this.page.locator('#PaymentErrorBanner');
  }

  async clickCheckOutButton(): Promise<void> {
    await this.checkoutButton.click();
    await this.contactTitle.waitFor({ state: 'visible' });
  }

  async getTotalPrice(): Promise<string | null> {
    await this.clickCheckOutButton();
    await this.calculatingText.waitFor({ state: 'hidden' });
    return await this.totalPrice.textContent();
  }

  async fillDeliveryForm(data: Array<object>): Promise<void> {
    for (const fieldData of data) {
      await this.fillTextBoXElByName(
        Object.keys(fieldData).toString(),
        Object.values(fieldData).toString()
      );
    }
  }

  async fillPaymentDetails(data: Array<object>): Promise<void> {
    for (const fieldData of data) {
      await this.fillIframeElById(
        Object.keys(fieldData).toString(),
        Object.values(fieldData).toString()
      );
    }
  }

  async getPaymentConfirmation(): Promise<string | null> {
    await this.payNowButton.click();
    await this.confiramtionMessage.waitFor({ state: 'visible' });
    return await this.confiramtionMessage.textContent();
  }

  async verifyEmailMessage(): Promise<string | null> {
    return await this.emailMessage.textContent();
  }

  async verifyCardMessage(): Promise<string | null> {
    await this.payNowButton.click();
    await this.cardMessage.waitFor({ state: 'visible' });
    return await this.cardMessage.textContent();
  }

  async verifyPaymentFailed(): Promise<boolean> {
    return await this.paymentErrorMessage.isVisible(); // could have used the same approach like verifyCardMessage/verifyEmailMessage
  }

  async isHeaderColorRed(field: string): Promise<boolean> {
    const fieldLocator =
      field === 'email' ? this.emailMessage : this.cardMessage;
    await fieldLocator.waitFor({ state: 'visible' });
    const color = await fieldLocator.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    return color === 'rgb(221, 29, 29)';
  }
}
