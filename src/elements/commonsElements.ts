import { type MapaElementos } from './elementRegistry';

export const commonsElementos: MapaElementos = {

  BOTAO: {
    'Login':   '[data-test="login-submit"]',
    'Módulo: Export': { seletor: '[class="module-box ng-star-inserted"]', texto: 'Export', exact: true },
  },

  CAMPO: {
    'Email': '#email',
    'Password': '#password',
  },

  COMBOBOX: {
    'Idioma': '#language-select',
  },

  CHECKBOX: {},

  VALIDACAO: {
    'ALERT':     '.alert',
    'ERRO':      '.bfm-error-message',
    'TÍTULO': { seletor: '.container h1', exact: false },
    'SUBTÍTULO': { seletor: '.container h2', exact: false },
  },

  MENUS_NAVEGACAO: {
    'Menu Principal': 'button.dropdown-toggle.btn-toolbar',
    'Submenu':        '.dropdown-submenu > a',
  },

  ENDPOINT: {
    'Dados Usuário': { url: 'api.practicesoftwaretesting.com/users/me', method: 'GET' },
    'Produtos Home': { url: '/api.practicesoftwaretesting.com/products', method: 'GET' },
  }

};
