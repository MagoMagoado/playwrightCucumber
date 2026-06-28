import { type Page} from '@playwright/test';
import { CommonsPage } from './commonsPage';
import { sauceElementos } from '@elements/sauceElements';

export class SaucePage extends CommonsPage {
  constructor(page: Page) {
    super(page);
    this.carregarElementos(sauceElementos);
  }
}
