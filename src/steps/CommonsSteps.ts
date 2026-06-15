import { Given, When, Then } from '@fixtures/fixtures';
import { expect } from '@playwright/test';

// ──────────────────────────────────────────────────────────────
// Contexto / Setup
// ──────────────────────────────────────────────────────────────

Given('que estou no documento {string}', async ({ pageContext }, documento: string) => {
  pageContext.ativarDocumento(documento);
});

// ──────────────────────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────────────────────

Given('que efetuo o login {string} utilizando o usuário {string}', async ({ loginPage }, tipoLogin: string, usuario: string) => {
  await loginPage.efetuarLogin(tipoLogin, usuario);
});

// ──────────────────────────────────────────────────────────────
// Navegação
// ──────────────────────────────────────────────────────────────

When('recarrego a página', async ({ pageContext }) => {
  await pageContext.activePage.recarregarPagina();
});

When('acesso o menu {string}', async ({ pageContext }, caminho: string) => {
  await pageContext.activePage.acessarMenuNavegacao(caminho.split(' > '));
});

// ──────────────────────────────────────────────────────────────
// Ações
// ──────────────────────────────────────────────────────────────

When('clico no botão {string}', async ({ pageContext }, nome: string) => {
  await pageContext.activePage.clicarBotao(nome);
});

When('preencho o campo {string} com {string}', async ({ pageContext }, nome: string, valor: string) => {
  await pageContext.activePage.preencherCampo(nome, valor);
});

When('seleciono no combobox {string} a opção {string}', async ({ pageContext }, nome: string, opcao: string) => {
  await pageContext.activePage.selecionarCombobox(nome, opcao);
});

When('marco o checkbox {string}', async ({ pageContext }, nome: string) => {
  await pageContext.activePage.marcarCheckbox(nome, true);
});

When('desmarco o checkbox {string}', async ({ pageContext }, nome: string) => {
  await pageContext.activePage.marcarCheckbox(nome, false);
});

// ──────────────────────────────────────────────────────────────
// Validações
// ──────────────────────────────────────────────────────────────

Then('visualizo o {string} com a mensagem {string}', async ({ pageContext }, tipo: string, mensagem: string) => {
  await pageContext.activePage.validarMensagem(tipo, mensagem, true);
});

Then('não visualizo o {string} com a mensagem {string}', async ({ pageContext }, tipo: string, mensagem: string) => {
  await pageContext.activePage.validarMensagem(tipo, mensagem, false);
});

Then('o campo {string} deve conter o valor {string}', async ({ pageContext }, nome: string, valorEsperado: string) => {
  const valor = await pageContext.activePage.obterValorCampo(nome);
  expect(valor).toBe(valorEsperado);
});

Then('valido se {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  await pageContext.activePage.validarEstado(nome, estado);
});

// ──────────────────────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────────────────────

When('pause', async ({ pageContext }) => {
  await pageContext.activePage.pause();
});
