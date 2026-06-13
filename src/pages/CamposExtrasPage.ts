import { type Page } from '@playwright/test';
import { CommonsPage } from './CommonsPage';
import { camposExtrasElementos } from '@elements/camposExtrasElements';

export class CamposExtrasPage extends CommonsPage {
  constructor(page: Page) {
    super(page); // já carrega commonsElementos
    this.carregarElementos(camposExtrasElementos);
  }
}
