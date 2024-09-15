import { PlaywrightTestConfig } from '@playwright/test';
import { error } from 'console';
import dotEnv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

async function globalSetup(config: PlaywrightTestConfig) {
  const env = process.env.test_env || null;
  if (env) {
    const currentEnv = dotEnv.config({
      path: `.env.${env}`,
      override: true,
    });
    dotenvExpand.expand(currentEnv);
  } else {
    throw 'env vars have not been initizalized';
  }
}

export default globalSetup;
