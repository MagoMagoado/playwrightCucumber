import { type Page, expect } from '@playwright/test';
import { CommonsPage } from './CommonsPage';
import { homeElementos } from '@elements/homeElements';

export class HomePage extends CommonsPage {
  constructor(page: Page) {
    super(page);
    this.carregarElementos(homeElementos);
    // se elementos estivem em tela com Iframe
      // this.carregarElementosEmIframe(homeElementos);
  }

  override async validarCategoriaProduto(nome: string, categoria: string): Promise<void> {
    if (categoria === 'B') {
      const config = this.buscarElemento('CAMPO', nome);
      const locator = this.toLocator(config).locator('.co2-letter.active');
      await expect(locator).toHaveClass(/rating-b/);

      console.log("Produto eco-friendly")
      return;
    }
    await super.validarCategoriaProduto(nome, categoria);
  }
}
