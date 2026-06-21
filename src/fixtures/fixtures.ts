import { test as base, createBdd } from 'playwright-bdd';
import { type Page } from '@playwright/test';
import { CommonsPage } from '@pages/commonsPage';
import { LoginPage } from '@pages/loginPage';
import { HomePage } from '@pages/homePage';

/**
 * Controla qual page está ativa no cenário. O step "que estou no documento" chama ativarDocumento(),
 * que instancia a page correspondente e a atribui a activePage — a partir daí todos os steps delegam para ela.
 *
 * Para adicionar uma nova tela: registrá-la no mapa pages e, se tiver steps próprios,
 * expô-la também como fixture em type Fixtures e em base.extend usando getPagina().
 */
export class PageContext {
  activePage: CommonsPage;
  private readonly pages: Map<string, () => CommonsPage>;

  constructor(page: Page) {
    this.activePage = new CommonsPage(page);
    this.pages = new Map<string, () => CommonsPage>([
      ['HOME', () => new HomePage(page)],
    ]);
  }

  ativarDocumento(documento: string): void {
    const pageChamada = this.pages.get(documento);
    if (!pageChamada) throw new Error(`Documento "${documento}" não registrado em PageContext`);
    this.activePage = pageChamada();
  }
}

type Fixtures = {
  pageContext: PageContext;
  loginPage: LoginPage;
  homePage: HomePage;
};

export const test = base.extend<Fixtures>({
  pageContext: async ({ page }, use) => {
    await use(new PageContext(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ pageContext }, use) => {
    pageContext.ativarDocumento('HOME');
    await use(pageContext.activePage as HomePage);
  }
});

export const { Given, When, Then } = createBdd(test);
