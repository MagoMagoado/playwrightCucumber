import { type Page, expect } from '@playwright/test';
import { CommonsPage } from './CommonsPage';
import { homeElementos } from '@elements/homeElements';

export class HomePage extends CommonsPage {
  constructor(page: Page) {
    super(page);
    this.carregarElementosEmIframe(homeElementos);
  }

  override async selecionarCombobox(nome: string, opcao: string): Promise<void> {
    const config = this.buscarElemento('COMBOBOX', nome);
    const container = this.toLocator(config);

    // abre o dropdown e filtra digitando no input interno do componente Angular
    const input = container.locator('input[role="combobox"]');
    await input.click({ timeout: 10000 });
    await input.fill(opcao);

    // clica na opção pelo texto exato dentro da lista
    const opcaoLocator = container.locator('.bento-list-row').getByText(opcao, { exact: true });
    await opcaoLocator.click();
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
