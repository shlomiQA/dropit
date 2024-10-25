import { Locator, Page } from 'playwright/test';
import BasePage from './base.page.ts';

export default class CatalogPage extends BasePage {
  searchButton: Locator;
  searchField: Locator;
  searchResults: Locator;
  resultTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.searchButton = this.page.locator('.header__search');
    this.searchField = this.page.getByPlaceholder('Search');
    this.searchResults = this.page.getByRole('option');
  }

  async searchProduct(term: string): Promise<void> {
    await this.searchButton.click();
    await this.searchField.fill(term);
    try {
      await this.searchResults.first().waitFor({ state: 'visible' });
    } catch (err) {
      throw `no such product or ${err}`;
    }
  }

  // this way we guarantee that if there are many results the func will capture the correct one
  async selectMatchingResult(title: string): Promise<void> {
    const allResults = await this.searchResults.all();
    for (const result of allResults) {
      const resultDetails = await result.textContent();
      if (resultDetails?.includes(title)) {
        await result.click();
        break;
      }
    }
  }
}
