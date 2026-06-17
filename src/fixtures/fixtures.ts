import { test as base, createBdd } from 'playwright-bdd';
import { type Page } from '@playwright/test';
import { CommonsPage } from '@pages/CommonsPage';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/homePage';

/**
 * Gerencia qual page está ativa durante o teste.
 * O step "que estou no documento" chama ativarDocumento() para trocar a page ativa.
 * Todos os steps de ação delegam para activePage, que executa o comportamento
 * correto de acordo com a page registrada para aquele documento.
 * Para adicionar uma nova tela: instanciar a page no constructor e registrá-la no mapa.
 */
export class PageContext {
  activePage: CommonsPage;
  private readonly paginas: Map<string, CommonsPage>;

  constructor(page: Page) {
    this.activePage = new CommonsPage(page);
    this.paginas = new Map<string, CommonsPage>([
      ['HOME', new HomePage(page)],
    ]);
  }

  ativarDocumento(documento: string): void {
    const pagina = this.paginas.get(documento);
    if (!pagina) throw new Error(`Documento "${documento}" não registrado em PageContext`);
    this.activePage = pagina;
  }
}

type Fixtures = {
  loginPage: LoginPage;
  pageContext: PageContext;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),

  pageContext: async ({ page }, use) => {
    await use(new PageContext(page));
  },
});

export const { Given, When, Then } = createBdd(test);
