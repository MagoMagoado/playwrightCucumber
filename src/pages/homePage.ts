import { type Page, type Locator, expect } from '@playwright/test';
import { CommonsPage } from './commonsPage';
import { homeElementos } from '@elements/homeElements';

export class HomePage extends CommonsPage {
  constructor(page: Page) {
    super(page);
    this.carregarElementos(homeElementos);
    // se elementos estivem em tela com Iframe
      // this.carregarElementosEmIframe(homeElementos);
  }

  // Método próprio de homePage
  async deslizarSlider(nome: string, valorMin: string, valorMax: string): Promise<void> {
    const config = this.buscarElemento('SLIDER', nome);
    const slider = this.toLocator(config);
    await slider.scrollIntoViewIfNeeded();

    const handleMin = slider.locator('.ngx-slider-pointer-min');
    const handleMax = slider.locator('.ngx-slider-pointer-max');

    const ajustarHandle = async (handle: Locator, alvo: number) => {
      await handle.focus();
      const atual = Number(await handle.getAttribute('aria-valuenow'));
      const passos = alvo - atual;
      const tecla = passos > 0 ? 'ArrowRight' : 'ArrowLeft';
      for (let i = 0; i < Math.abs(passos); i++) {
        await handle.press(tecla);
      }
    };

    const alvoMin = Number(valorMin);
    const alvoMax = Number(valorMax);

    // ordem segura: se o novo mínimo ultrapassa o máximo atual, move o máximo primeiro
    const maxAtual = Number(await handleMax.getAttribute('aria-valuenow'));
    if (alvoMin > maxAtual) {
      await ajustarHandle(handleMax, alvoMax);
      await ajustarHandle(handleMin, alvoMin);
    } else {
      await ajustarHandle(handleMin, alvoMin);
      await ajustarHandle(handleMax, alvoMax);
    }
  }

  // Método override de commonsPage
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
