import { type MapaElementos } from './elementRegistry';

export const sauceElementos: MapaElementos = {

  BOTAO: {
    'Produto Sauce Labs Fleece Jacket': { seletor: '[data-test="inventory-item-name"]', texto: 'Sauce Labs Fleece Jacket' },
    'Add Sauce Labs Backpack': { seletor: '[data-test="add-to-cart-sauce-labs-backpack"]'},
    'Add Sauce Labs Bike Light': { seletor: '[data-test="add-to-cart-sauce-labs-bike-light"]'},
    'Remove Sauce Labs Backpack': '[data-test="remove-sauce-labs-backpack"]',
    'Carrinho': '[data-test="shopping-cart-link"]',
    'Menu': '#react-burger-menu-btn',
    'Reset App': '#reset_sidebar_link',
    'Continue': '[data-test="continue"]',
    'Checkout': '[data-test="checkout"]',
    'Finish': '[data-test="finish"]',
  },

  CAMPO: {
    'Produto Nome': '[data-test="inventory-item-name"]',
    'Produto Preço': '[data-test="inventory-item-price"]',
    'Quantidade Carrinho': '[data-test="item-quantity"]',
    'First Name': '[data-test="firstName"]',
    'Last Name': '[data-test="lastName"]',
    'Postal Code': '[data-test="postalCode"]',
    'Info Compra': '[class^="summary_"]'
  },

  COMBOBOX: {
    'Filtro: Sort': '.product_sort_container',
  },

  VALIDACAO: {
    'TÍTULO':    { seletor: '.app_logo', exact: false },
    'Quantidade Produtos': '[data-test="shopping-cart-badge"]',
  },

};
