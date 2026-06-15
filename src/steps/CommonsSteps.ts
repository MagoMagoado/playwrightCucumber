import { Given, When, Then } from '@fixtures/fixtures';
import { expect } from '@playwright/test';
import { REGISTRO_DOCUMENTOS } from '@elements/elementRegistry';

// ──────────────────────────────────────────────────────────────
// Contexto / Setup
// ──────────────────────────────────────────────────────────────

Given('que estou no documento {string}', async ({ commonsPage }, documento: string) => {
  const registro = REGISTRO_DOCUMENTOS[documento];
  if (!registro) throw new Error(`Documento "${documento}" não registrado em elementRegistry.ts`);
  if (registro.usaIframe) {
    commonsPage.carregarElementosEmIframe(registro.elementos);
  } else {
    commonsPage.carregarElementos(registro.elementos);
  }
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

When('recarrego a página', async ({ commonsPage }) => {
  await commonsPage.recarregarPagina();
});

When('acesso o menu {string}', async ({ commonsPage }, caminho: string) => {
  await commonsPage.acessarMenuNavegacao(caminho.split(' > '));
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

Then('valido se {string} está {string}', async ({ camposExtrasPage }, nome: string, estado: string) => {
  await camposExtrasPage.validarEstado(nome, estado);
});

// ──────────────────────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────────────────────

When('pause', async ({ commonsPage }) => {
    await commonsPage.pause();
});