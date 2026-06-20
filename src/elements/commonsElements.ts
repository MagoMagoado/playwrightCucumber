import { type MapaElementos } from './elementRegistry';

export const commonsElementos: MapaElementos = {

  BOTAO: {
    'Sign in':        { seletor: '[data-test="nav-sign-in"]', texto: 'Sign in', exact: true },
    'Login':          { seletor: '[data-test="login-submit"]', texto: 'Login', exact: true },
    'Contact: Send':  '[data-test="contact-submit"]',
  },

  CAMPO: {
    'Email':                '#email',
    'Password':             '#password',
    'Contact: First name':  '[data-test="first-name"]',
    'Contact: Last name':   '[data-test="last-name"]',
    'Contact: Email':       '[data-test="email"]',
    'Contact: Message':     '[data-test="message"]',
  },

  COMBOBOX: {
    'Idioma':           '#language-select',
    'Contact: Subject': '[data-test="subject"]',
  },

  CHECKBOX: {},

  VALIDACAO: {
    'ALERT':     '.alert',
    'ERRO':      '.bfm-error-message',
    'TÍTULO': { seletor: '.container h1', exact: false },
    'SUBTÍTULO': { seletor: '.container h2', exact: false },
  },

  MENUS_NAVEGACAO: {
    'Menu Principal': '.navbar-nav .nav-link',
    'Submenu':        '.dropdown-menu a',
  },

  ENDPOINT: {
    'Dados Usuário': { seletor: 'api.practicesoftwaretesting.com/users/me', methodURL: 'GET' },
    'Produtos Home': { seletor: '/api.practicesoftwaretesting.com/products', methodURL: 'GET' },
  }

};
