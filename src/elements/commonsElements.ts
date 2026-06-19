import { type MapaElementos } from './elementRegistry';

export const commonsElementos: MapaElementos = {

  BOTAO: {
    'Sign in': { seletor: '[data-test="login-submit"]', texto: 'Sign in', exact: true },
    'Login': { seletor: '[data-test="login-submit"]', texto: 'Login', exact: true },
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
    'Dados Usuário': { seletor: 'api.practicesoftwaretesting.com/users/me', methodURL: 'GET' },
    'Produtos Home': { seletor: '/api.practicesoftwaretesting.com/products', methodURL: 'GET' },
  }

};
