import { type MapaElementos } from './elementRegistry';

export const camposExtrasElementos: MapaElementos = {

  BOTAO: {
    'Campos Extras: Filtrar': '#base-button-filter',
    'Filtro: Adicionar': { seletor: '[id="tblItem-adicionar-adiantamento"]', waitAfter: 'loader' },
    'Grid Visualizar': '.bento-icon-eye.grid-action-icon ',
    'Último editar grid': '#edit-72df6b00-85f9-46e1-aa86-f93a2456786e',
  },

  CAMPO: {
    'Filtro: Entidade': '[name="dfEntidade"]',
  },

  COMBOBOX: {
    'Filtro: Sistema': '#cmbSistema',
  },

  LABEL: {},

};
