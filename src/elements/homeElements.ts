import { type MapaElementos } from './elementRegistry';

export const homeElementos: MapaElementos = {

  BOTAO: {
    'Search': '[data-test="search-submit"]',
    'Limpar Filtro': '.btn-warning',
  },

  CAMPO: {
    'Filtro: Entidade': '[name="dfEntidade"]',
    'Filtro: By category' : { seletor: '#filters h4', texto: 'By category:', exact: true },
    'Filtro: Search' : '[data-test="search-query"]',
    'Produto Nome' : { seletor: '[data-test="product-name"]'},
    'Produto Wood Saw': { seletor: '.card-body', texto: 'Wood Saw' },
  },

  COMBOBOX: {
    'Filtro: Sort': '#filters select.form-select',
  },

  CHECKBOX: {
    'Filtro: Hammer': { seletor: 'fieldset .checkbox', texto: 'Hammer', exact: true },
    'Filtro: Hand Saw': { seletor: 'fieldset .checkbox', texto: 'Hand Saw', exact: true },
  },

  VALIDACAO: {
    'Quantidade Produtos': { seletor: '[data-test="search-result-count"]', exact: true },
  },

  SLIDER: {
    'Filtro: Preço': 'ngx-slider.ngx-slider',
  },
};
