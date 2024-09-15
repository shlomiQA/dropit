import { test, expect } from '@playwright/test';
import { environment } from '../utils/env';
import TodoPage from '../pages/todos.page.ts';

test.describe('two tests', () => {
  test.beforeEach('navigate to home page', async ({ page }) => {
    await page.goto(environment.baseUrl);
  });

  test('Verifying todo can be created successfully', async ({ page }) => {
    const todo = new TodoPage(page);
    const todoName = 'Adding Todo';

    await todo.createNewToDo(todoName);
    expect(await todo.getToDoName()).toMatch(todoName);
  });

  test('Verifying todo can be edited successfully', async ({ page }) => {
    const todo = new TodoPage(page);
    const priorEditionToDoName = 'Before Editing';
    const afterEditionToDoName = 'After Editing';

    await todo.createNewToDo(priorEditionToDoName);
    expect(await todo.getToDoName()).toMatch(priorEditionToDoName); // at first, we verify its created with correct input value

    await todo.editLastCreatedToDo(afterEditionToDoName);
    expect(await todo.getToDoName()).toMatch(afterEditionToDoName); // lastly, we verify that the name has changed and matches the second value
  });

  test('Verifying todo can be marked as completed', async ({ page }) => {
    const todo = new TodoPage(page);
    const todoName = 'Marking Todo';

    await todo.createNewToDo(todoName);
    await todo.checkMarkToDo(); // can be enhanced to pass the todo name go over all the list and find the exact one - due to time constraints applied this instead.
    expect(await todo.isStyleInItem()).toBeTruthy();
  });

  test('Verifying todo can be deleted successfully', async ({ page }) => {
    const todo = new TodoPage(page);
    const todoName = 'Removing Todo';

    await todo.createNewToDo(todoName);
    await todo.removeToDo();
    expect(await todo.isToDoInList()).toBeFalsy();
  });

  test('Verifying filter display is correct', async ({ page }) => {
    const todo = new TodoPage(page);
    const todosNames = ['Active Todo', 'Completed Todo']; // could be enhanced by using object that pass both type and name e.g. {'active': 'activeToDoName'} implemented array due to time constraints

    await todo.createNewToDo(todosNames[0]);
    await todo.checkMarkToDo();
    await todo.createNewToDo(todosNames[1]);
    expect(await todo.verifyAllToDosFiltered()).toBe(todosNames.length);
    expect(await todo.verifyActiveToDosFiltered()).toBe(1);
    expect(await todo.verifyCompletedToDosFiltered()).toBe(1);
  });

  test('Verifying clear completed removes all completed todos', async ({
    page,
  }) => {
    const todo = new TodoPage(page);
    const todosNames = ['Active Todo', 'Completed Todo'];

    await todo.createNewToDo(todosNames[0]);
    await todo.checkMarkToDo();
    await todo.createNewToDo(todosNames[1]);

    const toDoItemsBeforeClearing = await todo.verifyAllToDosFiltered();
    await todo.clearCompletedTodos();
    const todoDoItemsAfterClearing = await todo.verifyAllToDosFiltered();
    expect(todoDoItemsAfterClearing).toBeLessThan(toDoItemsBeforeClearing);
  });
});
