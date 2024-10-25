import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/login.page.ts';
import CatalogPage from '../../pages/catalog.page.ts';
import ItemPage from '../../pages/catalog.item.page.ts';
import CartPage from '../../pages/cart.page.ts';
import CheckoutPage from '../../pages/checkout.page.ts';
import {
  deliveryData,
  paymentData,
  invalidPaymentData,
  invalidDeliveryData,
} from '../../assets/data.json'; // see comment line 18

test.describe('testing dropit ui scenarios', () => {
  test.beforeEach('navigate to home page', async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.fillPassword('giclao');
    await login.clicksubscribeButton();
    const title = await login.getPageTitle();
    expect(title).toContain('Welcome');
  });

  // global declaration - alternative way vs importing json from assets eg. const deliverData = [ { Email: 'fake@email.com' }, etc...

  test('adding items to cart successfully', async ({ page }) => {
    const catalog = new CatalogPage(page);
    const item = new ItemPage(page);
    const checkout = new CheckoutPage(page);
    const cart = new CartPage(page);
    const first_product = 'Dropit Hamburger (QA Automation)';
    const second_product = 'Dropit Chips (QA Automation)';

    await catalog.selectTabByName('catalog'); // inherited from basePage for reuse
    const catalogTitle = await catalog.getPageTitle();
    expect(catalogTitle).toContain('Products');

    await catalog.searchProduct(first_product);
    await catalog.selectMatchingResult(first_product);
    expect(page.url()).toContain('automation-hamburger');
    expect(await item.isTitleShown(first_product)).toBeTruthy();

    await item.selectSize('Medium');
    await item.fillQuantity('2');
    await item.addItemToCart();
    expect(await item.isItemAdded()).toBeTruthy();

    await item.continueShoppingSameItem('eat it', '1');
    await item.addItemToCart();
    expect(await item.isItemAdded()).toBeTruthy();

    await catalog.navigateBack();

    await catalog.searchProduct(second_product);
    await catalog.selectMatchingResult(second_product);
    expect(page.url()).toContain('chips-qa-automation');
    expect(await item.isTitleShown(second_product)).toBeTruthy();

    await item.selectSize('Large');
    await item.fillQuantity('2');
    await item.addItemToCart();
    expect(await item.isItemAdded()).toBeTruthy();

    await item.continueShoppingSameItem('Too much', '1');
    await item.addItemToCart();
    expect(await item.isItemAdded()).toBeTruthy();

    expect(await item.getAmountUponCartIcon()).toContain('6'); // BONUS 1

    await item.navigateToCart();
    expect(await cart.getSubTotalPrice()).toBe('£33.00 GBP'); // BONUS 3

    expect(await checkout.getTotalPrice()).toBe('£56.99');

    await checkout.fillDeliveryForm(deliveryData);
    await checkout.fillPaymentDetails(paymentData);
    expect(await checkout.getPaymentConfirmation()).toContain('Thank you!');
  });

  test('failure to place order with invalid details ', async ({ page }) => {
    const catalog = new CatalogPage(page);
    const item = new ItemPage(page);
    const checkout = new CheckoutPage(page);
    const first_product = 'Dropit Hamburger (QA Automation)';
    const second_product = 'Dropit Chips (QA Automation)';

    await catalog.selectTabByName('catalog');
    const catalogTitle = await catalog.getPageTitle();
    expect(catalogTitle).toContain('Products');

    await catalog.searchProduct(first_product);
    await catalog.selectMatchingResult(first_product);
    expect(page.url()).toContain('automation-hamburger');
    expect(await item.isTitleShown(first_product)).toBeTruthy();

    await item.selectSize('Medium');
    await item.fillQuantity('3');
    await item.addItemToCart();
    expect(await item.isItemAdded()).toBeTruthy();

    await catalog.navigateBack();

    await catalog.searchProduct(second_product);
    await catalog.selectMatchingResult(second_product);
    expect(page.url()).toContain('chips-qa-automation');
    expect(await item.isTitleShown(second_product)).toBeTruthy();

    await item.selectSize('Large');
    await item.fillQuantity('1');
    await item.addItemToCart();
    expect(await item.isItemAdded()).toBeTruthy();

    await item.navigateToCart();

    expect(await checkout.getTotalPrice()).toBe('£47.99');

    await checkout.fillDeliveryForm(invalidDeliveryData);
    await checkout.fillPaymentDetails(invalidPaymentData);
    expect(await checkout.verifyEmailMessage()).toBe('Enter a valid email');

    expect(await checkout.isHeaderColorRed('email')).toBeTruthy(); //BONUS 2

    await checkout.fillDeliveryForm(deliveryData); // fixing to valid email
    expect(await checkout.verifyCardMessage()).toBe(
      'Enter a valid card number'
    );
    expect(await checkout.isHeaderColorRed('card')).toBeTruthy(); //BONUS 2
    expect(await checkout.verifyPaymentFailed()).toBeTruthy();
  });
});
