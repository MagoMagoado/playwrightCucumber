import { type Page, type Locator, expect } from '@playwright/test';
import { commonsElementos } from '@elements/commonsElements';
import { type ElementConfig, type MapaElementos } from '@elements/elementRegistry';

export class CommonsPage {
  protected page: Page;
  private elementMap: MapaElementos = {};
  private framedSelectors: Map<string, string> = new Map();

  constructor(page: Page) {
    this.page = page;
    this.page.setDefaultTimeout(60_000); // 1 min padrão para todas as ações, se precisar mais colocar específico em ação
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
  carregarElementosEmIframe(elementos: MapaElementos): void {
    this.carregarElementos(elementos);
    for (const categoria of Object.values(elementos)) {
      for (const config of Object.values(categoria)) {
        const seletor = typeof config === 'string' ? config : config.seletor;
        this.framedSelectors.set(seletor, 'iframe');
      }
    }
  }

  carregarElementos(elementos: MapaElementos): void {
    for (const categoria in elementos) {
      this.elementMap[categoria] = {
        ...this.elementMap[categoria],
        ...elementos[categoria],
      };
    }
  }

  protected buscarElemento(categoria: string, nome: string): ElementConfig {
    // se começa com '.', '#' ou '[' já é um seletor CSS, não precisa buscar no mapa
    if (/^[.#\[]/.test(nome)) return nome;
    const elemento = this.elementMap[categoria]?.[nome];
    if (elemento !== undefined) return elemento as ElementConfig;
    throw new Error(`Elemento "${nome}" não encontrado na categoria "${categoria}"`);
  }

  protected buscarElementoEmQualquerCategoria(nome: string): ElementConfig {
    // se começa com '.', '#' ou '[' já é um seletor CSS, não precisa buscar no mapa
    if (/^[.#\[]/.test(nome)) return nome;
    for (const categoria of Object.keys(this.elementMap)) {
      const elemento = this.elementMap[categoria]?.[nome];
      if (elemento !== undefined) return elemento as ElementConfig;
    }
    throw new Error(`Elemento "${nome}" não encontrado em nenhuma categoria`);
  }

  protected toLocator(config: ElementConfig): Locator {
    const seletor = typeof config === 'string'
      ? config
      : config.seletor;

    const frameSelector = this.framedSelectors.get(seletor);
    const tipoContexto = frameSelector
      ? this.page.frameLocator(frameSelector)
      : this.page;

    if (typeof config === 'string') {
      return tipoContexto.locator(config);
    }

    const { index, texto, exact } = config;
    let locator = tipoContexto.locator(seletor);
    if (texto) {
      // \s* tolera espaços/quebras de linha ao redor do texto, mas ainda pega o texto exato
      locator = locator.filter({ hasText: exact ? new RegExp(`^\\s*${texto}\\s*$`) : texto });
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
      case 'networkidle': // aguarda até a rede ficar sem requisições ativas
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

  // Navega pelo menu usando "Item > Submenu". Passa por subníveis intermediários com hover antes de clicar no último.
  async acessarMenuNavegacao(caminho: string): Promise<void> {
    const itens = caminho.split(' > ');
    await this.aguardarCarregamentoPagina('networkidle');

    const menuPrincipal = this.buscarElemento('MENUS_NAVEGACAO', 'Menu Principal');
    await this.toLocator(menuPrincipal).filter({ hasText: itens[0] }).first().click();

    if (itens.length > 1) {
      const submenu = this.buscarElemento('MENUS_NAVEGACAO', 'Submenu');
      for (let i = 1; i < itens.length; i++) {
        const locator = this.toLocator(submenu).getByText(itens[i], { exact: true }).first();
        if (i < itens.length - 1) {
          await locator.hover();
        } else {
          await locator.click();
        }
      }
    }
    await this.aguardarCarregamentoPagina('navigation');
  }

  // ──────────────────────────────────────────────────────────────
  // Ações
  // ──────────────────────────────────────────────────────────────

  async clicarBotao(nome: string): Promise<void> {
    const config = this.buscarElemento('BOTAO', nome);
    const locator = this.toLocator(config);
    await expect(locator, `Botão "${nome}" não encontrado na página`).toBeVisible();
    await locator.click();

    if (typeof config === 'object' && config.waitAfter) {
      await this.aguardarCarregamentoPagina(config.waitAfter);
    }
  }

  async preencherCampo(nome: string, valor: string): Promise<void> {
    const config = this.buscarElemento('CAMPO', nome);
    const locator = this.toLocator(config);
    await expect(locator, `Campo "${nome}" não encontrado na página`).toBeVisible();
    await locator.clear();
    await locator.fill(valor);
  }

  async selecionarCombobox(nome: string, opcao: string): Promise<void> {
    const config = this.buscarElemento('COMBOBOX', nome);
    const locator = this.toLocator(config);
    await expect(locator, `Combobox "${nome}" não encontrado na página`).toBeVisible();
    await locator.selectOption({ label: opcao });
  }

  async marcarCheckbox(marcar: string, nome: string): Promise<void> {
    const config = this.buscarElemento('CHECKBOX', nome);
    const locator = this.toLocator(config).locator('input[type="checkbox"]');
    await expect(locator, `Checkbox "${nome}" não encontrado na página`).toBeVisible();
    if (marcar === 'MARCO') {
      await locator.check();
    } else {
      await locator.uncheck();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Validações
  // ──────────────────────────────────────────────────────────────

  async validarMensagem(estado: string, tipo: string, mensagem: string): Promise<void> {
    const config = this.buscarElementoEmQualquerCategoria(tipo);
    const elemento = this.toLocator(config).filter({ hasText: mensagem });
    if (estado === 'VISUALIZO') {
      await expect(elemento, `"${tipo}" com a mensagem "${mensagem}" não está visível`).toBeVisible();
    } else {
      await expect(elemento, `"${tipo}" com a mensagem "${mensagem}" ainda está visível`).toBeHidden();
    }
  }

  async validarValorCampo(nome: string, valorEsperado: string): Promise<void> {
    const locator = this.toLocator(this.buscarElemento('CAMPO', nome));
    await locator.scrollIntoViewIfNeeded();
    expect(await locator.textContent()).toBe(valorEsperado);
  }

  async validarEstado(nome: string, estado: string): Promise<void> {
    const config = this.buscarElementoEmQualquerCategoria(nome);
    const locator = this.toLocator(config);
    if (estado === 'DESABILITADO') {
      await expect(locator).toBeDisabled();
    } else {
      await expect(locator).toBeEnabled();
    }
  }

  async validarCheckboxEstado(nome: string, estado: string): Promise<void> {
    const config = this.buscarElemento('CHECKBOX', nome);
    const locator = this.toLocator(config).locator('input[type="checkbox"]');
    if (estado === 'MARCADO') {
      await expect(locator).toBeChecked();
    } else {
      await expect(locator).not.toBeChecked();
    }
  }

  async validarOpcoesCombobox(nome: string, linhas: { OPCAO: string }[]): Promise<void> {
    const opcoes = this.toLocator(this.buscarElemento('COMBOBOX', nome)).locator('option');

    for (const { OPCAO } of linhas) {
      await expect(opcoes.filter({ hasText: OPCAO.trim() })).toBeAttached();
    }
  }

  // elementos que repetem o mesmo seletor com textos distintos (ex: lista de produtos).
  async validarCamposPorLabel(linhas: { NOME: string; TIPO: string; VALOR: string }[]): Promise<void> {
    for (const { NOME, TIPO, VALOR } of linhas) {
      const config = this.buscarElemento(TIPO.toUpperCase(), NOME);
      const locator = this.toLocator(config).getByText(VALOR.trim(), { exact: true });
      await locator.scrollIntoViewIfNeeded();
      await expect(locator).toBeVisible();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Utilitários
  // ──────────────────────────────────────────────────────────────

  async pause(): Promise<void> {
    await this.page.pause();
  }

  async tirarScreenshot(nomeArquivo: string, fullPage = false): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${nomeArquivo}.png`, fullPage });
  }
}
