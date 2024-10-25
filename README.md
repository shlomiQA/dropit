## Project Title

dropit-home-assignment

## Installations

1. Clone the repo
2. Navigate to project folder
3. Download VSCode editor
4. Extension (optional) -> Install "Playwright Test for VSCode"
5. Install deps in terminal as follow:
   5.1 Download and install node from the Node.js website.
   5.2 Run npm init -y in terminal
   5.3 Run npm install -D @playwright/test
   5.4 browsers: Run npx playwright install
   5.5 eslint: Run npm install --save-dev eslint
   5.6 prettier: Run npm install --save-dev prettier

## Testing

1. For headless mode use the following script in terminal: comment playwright.config.ts headless: true or remove it
2. For ui mode use the following script in terminal: uncomment playwright.config.ts headless: true
3. To run all tests in terminal: npm run e2e:test

## Debugging

Implement pause() function in the required line or use the --debug flag in the script
