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

  override async validarEstado(nome: string, estado: string): Promise<void> {
    if (nome === 'Último editar grid') {
      // esse elemento indica disabled via ícone filho .disabled-icon, não pelo atributo disabled
      const elemento = this.toLocator(this.buscarElementoEmQualquerCategoria(nome));
      await elemento.scrollIntoViewIfNeeded();
      if (estado === 'DESABILITADO') {
        await expect(elemento).toHaveClass(/disabled-icon/);
      } else {
        await expect(elemento).not.toHaveClass(/disabled-icon/);
      }
      return;
    }
    await super.validarEstado(nome, estado);
  }
}
