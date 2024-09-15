import { Locator, Page } from 'playwright/test';
import Helpers from '../../helpers.ts';

export default class TodoPage {
  page: Page;
  toDoHeaderInput: Locator;
  todoItem: Locator;
  toDoItemInput: Locator;
  checkBoxButton: Locator;
  itemSelector: string;
  removeToDoButton: Locator;
  allFilterButton: Locator;
  activeFilterButton: Locator;
  completedFilterButton: Locator;
  clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toDoHeaderInput = this.page
      .getByTestId('header')
      .getByTestId('text-input');
    this.todoItem = this.page.locator('label[data-testid="todo-item-label"]');
    this.toDoItemInput = this.page
      .getByTestId('todo-item')
      .getByTestId('text-input');
    this.checkBoxButton = this.page.getByTestId('todo-item-toggle');
    this.itemSelector = 'label[data-testid="todo-item-label"]';
    this.removeToDoButton = this.page.getByTestId('todo-item-button');
    this.allFilterButton = this.page.getByRole('link', { name: 'All' });
    this.activeFilterButton = this.page.getByRole('link', { name: 'Active' });
    this.completedFilterButton = this.page.getByRole('link', {
      name: 'Completed',
    });
    this.clearCompletedButton = this.page.getByRole('button', {
      name: 'Clear completed',
    });
  }

  public async createNewToDo(name: string): Promise<void> {
    await this.toDoHeaderInput.click();
    await this.toDoHeaderInput.fill(name);
    await this.page.keyboard.press('Enter');
    await this.todoItem.last().waitFor({ state: 'attached' }); // item we create is always last at the list , we need this in case we create multiple todos.
  }

  public async getToDoName(): Promise<string | null> {
    return await this.todoItem.textContent();
  }

  public async editLastCreatedToDo(editedname: string): Promise<void> {
    await this.todoItem.dblclick();
    await this.toDoItemInput.clear();
    await this.toDoItemInput.fill(editedname);
    await this.page.keyboard.press('Enter');
    await this.todoItem.waitFor({ state: 'attached' });
  }

  public async checkMarkToDo(): Promise<void> {
    await this.checkBoxButton.click();
    // await this
  }

  public async isStyleInItem(): Promise<boolean | null> {
    const helper = new Helpers(this.page);
    return await helper.getItemStyle(this.itemSelector);
  }

  public async removeToDo(): Promise<void> {
    await this.todoItem.hover();
    await this.removeToDoButton.click();
    await this.todoItem.waitFor({ state: 'detached' });
  }

  public async isToDoInList(): Promise<boolean> {
    return await this.todoItem.isVisible();
  }

  public async verifyAllToDosFiltered() {
    await this.allFilterButton.click();
    return await this.todoItem.count();
  }

  public async verifyActiveToDosFiltered() {
    await this.activeFilterButton.click();
    return await this.todoItem.count();
  }

  public async verifyCompletedToDosFiltered() {
    await this.completedFilterButton.click();
    return await this.todoItem.count();
  }

  public async clearCompletedTodos() {
    await this.clearCompletedButton.click();
  }
}
