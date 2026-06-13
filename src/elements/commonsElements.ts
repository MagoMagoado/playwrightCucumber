import { type MapaElementos } from '@pages/CommonsPage';

export const commonsElementos: MapaElementos = {

  BOTAO: {
    'Entrar':   '#submit-btn',
    'Módulos':  '[class="module-box ng-star-inserted"]',
  },

  CAMPO: {
    'Usuário': '#username',
    'Senha':   '#password',
  },

  COMBOBOX: {
    'Idioma': '#language-select',
  },

  CHECKBOX: {},

  VALIDACAO: {
    'ALERT':     '.alert',
    'ERRO':      '.bfm-error-message',
    'SUBTÍTULO': { seletor: 'h2', exact: false },
  },

  MENUS_NAVEGACAO: {
    'Menu Principal':             '[class="smart-badge-host"]',
    'Adiantamentos e Pagamentos': '[id="dropdown-submenu-1-adiantamentos-e-pagamentos"]',
    'Ordem de Importação':        '[id="dropdown-submenu-1-ordem-de-importacao"]',
    'Ordem':                      '[id="dropdown-submenu-2-ordem"]',
    'Fatura de Importação':       '[id="dropdown-submenu-1-fatura-de-importacao"]',
    'Fatura':                     '[id="dropdown-submenu-2-fatura"]',
    'Despesas Reais':             '[id="dropdown-submenu-1-despesas-reais"]',
  },

};

// Caminho completo de cada página no menu (sequência de cliques/hovers após abrir o Menu Principal)
const MENU_COMPLETO: Record<string, string[]> = {
  'Adiantamentos e Pagamentos': ['Adiantamentos e Pagamentos'],
  'Ordem de Importação':        ['Ordem de Importação', 'Ordem'],
  'Fatura de Importação':       ['Fatura de Importação', 'Fatura'],
  'Despesas Reais':             ['Despesas Reais'],
};

export function buscarCaminhoMenu(pagina: string): string[] {
  const caminho = MENU_COMPLETO[pagina];
  if (!caminho) throw new Error(`Caminho de menu para "${pagina}" não encontrado em commonsElements.ts`);
  return caminho;
}
