import { test as base, createBdd } from 'playwright-bdd';
import { CommonsPage } from '@pages/CommonsPage';
import { LoginPage } from '@pages/LoginPage';
import { CamposExtrasPage } from '@pages/CamposExtrasPage';

type Fixtures = {
  commonsPage:     CommonsPage;
  loginPage:       LoginPage;
  camposExtrasPage: CamposExtrasPage;
};

export const test = base.extend<Fixtures>({
  commonsPage:     async ({ page }, use) => use(new CommonsPage(page)),
  loginPage:       async ({ page }, use) => use(new LoginPage(page)),
  camposExtrasPage: async ({ page }, use) => use(new CamposExtrasPage(page)),

  //trava o teste caso de falha com tela de debug
  page: async ({ page }, use, testInfo) => {
    await use(page);
    if (testInfo.status === 'failed') {
      await page.pause();
    }
  },
});

export const { Given, When, Then } = createBdd(test);
