import { type Page, expect } from '@playwright/test';
import { CommonsPage } from './CommonsPage';
import { camposExtrasElementos } from '@elements/camposExtrasElements';

const ESTADOS_COM_CLASSE_DISABLED: Record<string, string> = {
  'Último editar grid': '.disabled-icon',
};

export class CamposExtrasPage extends CommonsPage {
  constructor(page: Page) {
    super(page); // já carrega commonsElementos
    this.carregarElementos(camposExtrasElementos);
  }

  override async validarEstado(nome: string, estado: string): Promise<void> {
    const seletorDisabled = ESTADOS_COM_CLASSE_DISABLED[nome];
    if (seletorDisabled) {
      const config = this.buscarElementoEmQualquerCategoria(nome);
      const icone = this.toLocator(config).locator(seletorDisabled);
      if (estado === 'DESABILITADO') {
        await expect(icone).toBeVisible();
      } else {
        await expect(icone).not.toBeVisible();
      }
      return;
    }
    await super.validarEstado(nome, estado);
  }
}
