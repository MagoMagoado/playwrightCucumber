import { type MapaElementos } from './elementRegistry';

export const commonsElementos: MapaElementos = {

  BOTAO: {
    'Entrar':   '#submit-btn',
    'Módulo: Export': { seletor: '[class="module-box ng-star-inserted"]', texto: 'Export' },
    'Filtrar': '#base-button-filter',
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
    'Menu Principal': 'button.dropdown-toggle.btn-toolbar',
    'Submenu':        '.dropdown-submenu > a',
  },

};
