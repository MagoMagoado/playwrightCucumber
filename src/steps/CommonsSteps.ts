import { Given, When, Then } from '@fixtures/fixtures';
import { expect } from '@playwright/test';
import { REGISTRO_DOCUMENTOS } from '@elements/elementRegistry';

// ──────────────────────────────────────────────────────────────
// Contexto / Setup
// ──────────────────────────────────────────────────────────────

Given('que estou no documento {string}', async ({ commonsPage }, documento: string) => {
  const elementos = REGISTRO_DOCUMENTOS[documento];
  if (!elementos) throw new Error(`Documento "${documento}" não registrado em elementRegistry.ts`);
  commonsPage.carregarElementos(elementos);
});

// ──────────────────────────────────────────────────────────────
// Login (stub — implementar conforme necessário)
// ──────────────────────────────────────────────────────────────

Given('que efetuo o login {string} utilizando o usuário {string}', async ({ loginPage }, tipoLogin: string, usuario: string) => {
  await loginPage.efetuarLogin(tipoLogin, usuario);
});

// ──────────────────────────────────────────────────────────────
// Navegação
// ──────────────────────────────────────────────────────────────

When('clico no módulo {string}', async ({ commonsPage }, modulo: string) => {
  await commonsPage.clicarModulo(modulo);
});

When('acesso pelo menu {string} a página {string}', async ({ commonsPage }, menuPrincipal: string, pagina: string) => {
  await commonsPage.acessarPaginaPeloMenu(menuPrincipal, pagina);
});

When('recarrego a página', async ({ commonsPage }) => {
  await commonsPage.recarregarPagina();
});

// ──────────────────────────────────────────────────────────────
// Ações
// ──────────────────────────────────────────────────────────────

When('clico no botão {string}', async ({ commonsPage }, nome: string) => {
  await commonsPage.clicarBotao(nome);
});

When('preencho o campo {string} com {string}', async ({ commonsPage }, nome: string, valor: string) => {
  await commonsPage.preencherCampo(nome, valor);
});

When('seleciono no combobox {string} a opção {string}', async ({ commonsPage }, nome: string, opcao: string) => {
  await commonsPage.selecionarCombobox(nome, opcao);
});

When('marco o checkbox {string}', async ({ commonsPage }, nome: string) => {
  await commonsPage.marcarCheckbox(nome, true);
});

When('desmarco o checkbox {string}', async ({ commonsPage }, nome: string) => {
  await commonsPage.marcarCheckbox(nome, false);
});

// ──────────────────────────────────────────────────────────────
// Validações
// ──────────────────────────────────────────────────────────────

Then('visualizo o {string} com a mensagem {string}', async ({ commonsPage }, tipo: string, mensagem: string) => {
  await commonsPage.validarMensagem(tipo, mensagem, true);
});

Then('não visualizo o {string} com a mensagem {string}', async ({ commonsPage }, tipo: string, mensagem: string) => {
  await commonsPage.validarMensagem(tipo, mensagem, false);
});

Then('o campo {string} deve conter o valor {string}', async ({ commonsPage }, nome: string, valorEsperado: string) => {
  const valor = await commonsPage.obterValorCampo(nome);
  expect(valor).toBe(valorEsperado);
});

Then('o elemento {string} deve conter o texto {string}', async ({ commonsPage }, nome: string, textoEsperado: string) => {
  const texto = await commonsPage.obterTexto(nome);
  expect(texto).toContain(textoEsperado);
});
