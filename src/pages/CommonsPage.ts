import { type Page, type Locator } from '@playwright/test';
import { commonsElementos, buscarCaminhoMenu } from '@elements/commonsElements';

type ElementoOpcoes = {
  seletor: string;
  index?: number;
  waitAfter?: 'networkidle' | 'loader' | 'navigation' | 'login';
  waitBefore?: 'networkidle' | 'loader' | 'navigation' | 'login';
  texto?: string;
  exact?: boolean;
};

/**
 * @param ElementConfig diz que pode ser só uma string normal para mapear ou pode usar das opções acima
 * @param MapaElementos  {CATEGORIA > (NOMEMAPEADO > opcoes mapeamento ou mapeamento simples)}
 EXEMPLO:
  BOTAO: {
    'Entrar': '#submit-btn',       // ElementConfig = string
    'Filtro: Adicionar': { seletor: '...', waitAfter: 'loader' }  // ElementConfig = objeto
  },
*/
export type ElementConfig = string | ElementoOpcoes;
export type MapaElementos = Record<string, Record<string, ElementConfig>>;

export class CommonsPage {
  protected page: Page;
  private elementMap: MapaElementos = {};

  constructor(page: Page) {
    this.page = page;
    this.carregarElementos(commonsElementos);
  }

  /**
   * Ordem de estrutura dos elementos carregados para serem usados:
   * @param elementMap - variável que guarda os elementos mapeados. Inicia vazia
   * @param constructor - ao criar a instância, chama carregarElementos(commonsElementos),
   *                      carregando os elementos comuns a todos os testes
   * @param carregarElementos() - popula o elementMap com os elementos recebidos por parâmetro.
   *                              Cada page filha também chama esse método no seu constructor
   *                              para adicionar seus elementos específicos ao mapa
   * @param Record<tipo_da_chave, tipo_do_valor> - dita o tipo que a variável é para o
   *                              TypeScript. Sem isso a linguagem reclama por não saber o formato
  */
  carregarElementos(elementos: MapaElementos): void {
    for (const categoria in elementos) {
      this.elementMap[categoria] = {
        ...this.elementMap[categoria],
        ...elementos[categoria],
      };
    }
  }

  private resolveElemento(categoria: string, nome: string): ElementConfig {
    if (/^[.#\[]/.test(nome)) return nome;
    const elemento = this.elementMap[categoria]?.[nome];
    if (elemento !== undefined) return elemento as ElementConfig;
    throw new Error(`Elemento "${nome}" não encontrado na categoria "${categoria}"`);
  }

  private toLocator(config: ElementConfig): Locator {
    if (typeof config === 'string') return this.page.locator(config);
    const { seletor, index, texto, exact } = config;
    let locator = this.page.locator(seletor);
    if (texto) {
      locator = locator.filter({ hasText: exact ? new RegExp(`^${texto}$`) : texto });
    }
    if (index !== undefined) {
      locator = index < 0 ? locator.last() : locator.nth(index);
    }
    return locator;
  }

  // ──────────────────────────────────────────────────────────────
  // Esperas
  // ──────────────────────────────────────────────────────────────

  async aguardarCarregamentoPagina(tipo: 'login' | 'navigation' | 'networkidle' | 'loader' = 'networkidle'): Promise<void> {
    switch (tipo) {
      case 'login':
      case 'navigation':
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        break;
      case 'loader':
        await this.page.waitForLoadState('load').catch(() => {});
        await this.page.waitForLoadState('networkidle').catch(() => {});
        break;
      case 'networkidle':
        await this.page.waitForLoadState('networkidle');
        break;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Navegação
  // ──────────────────────────────────────────────────────────────

  async navegarPara(url: string): Promise<void> {
    await this.page.goto(url);
    await this.aguardarCarregamentoPagina();
  }

  async recarregarPagina(): Promise<void> {
    await this.page.reload();
    await this.aguardarCarregamentoPagina();
  }

  // ──────────────────────────────────────────────────────────────
  // Módulo e Menu
  // ──────────────────────────────────────────────────────────────

  async clicarModulo(modulo: string): Promise<void> {
    const config = this.resolveElemento('BOTAO', 'Módulos');
    const locator = this.toLocator(config);
    await locator.filter({ hasText: modulo }).first().click();
    await this.aguardarCarregamentoPagina('navigation');
  }

  async acessarPaginaPeloMenu(menuPrincipal: string, pagina: string): Promise<void> {
    await this.aguardarCarregamentoPagina('networkidle');

    const configMenu = this.resolveElemento('MENUS_NAVEGACAO', 'Menu Principal');
    await this.toLocator(configMenu).filter({ hasText: menuPrincipal }).first().click();

    const caminho = buscarCaminhoMenu(pagina);

    for (let i = 0; i < caminho.length; i++) {
      const config = this.resolveElemento('MENUS_NAVEGACAO', caminho[i]);
      const locator = this.toLocator(config);
      const isUltimo = i === caminho.length - 1;

      if (isUltimo) {
        await locator.first().click();
        await this.aguardarCarregamentoPagina('navigation');
      } else {
        await locator.first().hover();
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Ações
  // ──────────────────────────────────────────────────────────────

  async clicarBotao(nome: string): Promise<void> {
    const config = this.resolveElemento('BOTAO', nome);
    const locator = this.toLocator(config);
    await locator.click();

    if (typeof config === 'object' && config.waitAfter) {
      await this.aguardarCarregamentoPagina(config.waitAfter);
    }
  }

  async preencherCampo(nome: string, valor: string): Promise<void> {
    const config = this.resolveElemento('CAMPO', nome);
    const locator = this.toLocator(config);
    await locator.clear();
    await locator.fill(valor);
  }

  async selecionarCombobox(nome: string, opcao: string): Promise<void> {
    const config = this.resolveElemento('COMBOBOX', nome);
    const locator = this.toLocator(config);
    await locator.selectOption({ label: opcao });
  }

  async marcarCheckbox(nome: string, marcar: boolean): Promise<void> {
    const config = this.resolveElemento('CHECKBOX', nome);
    const locator = this.toLocator(config);
    if (marcar) {
      await locator.check();
    } else {
      await locator.uncheck();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Validações
  // ──────────────────────────────────────────────────────────────

  async validarMensagem(tipo: string, mensagem: string, visivel = true): Promise<void> {
    const config = this.resolveElemento('VALIDACAO', tipo);
    const elemento = this.toLocator(config).filter({ hasText: mensagem });
    if (visivel) {
      await elemento.waitFor({ state: 'visible' });
    } else {
      await elemento.waitFor({ state: 'hidden' });
    }
  }

  async obterTexto(nome: string): Promise<string> {
    const config = this.resolveElemento('VALIDACAO', nome);
    return (await this.toLocator(config).textContent()) ?? '';
  }

  async obterValorCampo(nome: string): Promise<string> {
    const config = this.resolveElemento('CAMPO', nome);
    return await this.toLocator(config).inputValue();
  }

  // ──────────────────────────────────────────────────────────────
  // Utilitários
  // ──────────────────────────────────────────────────────────────

  async tirarScreenshot(nomeArquivo: string, fullPage = false): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${nomeArquivo}.png`, fullPage });
  }
}
