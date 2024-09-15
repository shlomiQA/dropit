## Project Title

shlomi-wecheck-todo-project

## Installations

1. Clone the repo
2. Navigate to project folder
3. Download vscode editor
4. Install deps in terminal as follow:
   4.1 Download and install from the Node.js website.
   4.2 Run npm init -y in terminal
   4.3 Run npm install -D @playwright/test
   4.4 Run npx playwright install
   4.5 eslint: Run npm install --save-dev eslint
   4.6 prettier: Run npm install --save-dev prettier
   4.7 Dotenv: Run npm install dotenv --save-dev
   4.8 Cross-env: Run npm install cross-env --save-dev

## Testing

1. For headless mode use the following script in terminal: comment playwright.config.ts headless: true or remove it
2. For ui mode use the following script in terminal: uncomment playwright.config.ts headless: true
3. To run test with env vars run in terminal: npm run e2e:test

## Debugging

Implement pause() function in the required line or use the --debug flag in the script
