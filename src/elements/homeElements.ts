import { type MapaElementos } from './elementRegistry';

export const homeElementos: MapaElementos = {

  BOTAO: {
    'Campos Extras: Filtrar': '#base-button-filter',
    'Filtro: Adicionar': { seletor: '[id="tblItem-adicionar-adiantamento"]', waitAfter: 'loader' },
    'Grid Visualizar': '.bento-icon-eye.grid-action-icon ',
    'Último editar grid': '[aria-rowindex="10"] .bento-icon-edit',
  },

  CAMPO: {
    'Filtro: Entidade': '[name="dfEntidade"]',
    'Produto Nome' : { seletor: '[data-test="product-name"]'},
  },

  COMBOBOX: {
    'Filtro: Sort': '#filters select.form-select',
  },

  CHECKBOX: {
    'Filtro: Hammer': { seletor: 'fieldset .checkbox input[name="category_id"]', texto: 'Hammer', exact: true }
  },
};
