import { Given, When, Then } from '@fixtures/fixtures';

// ──────────────────────────────────────────────────────────────
// Contexto / Setup
// ──────────────────────────────────────────────────────────────

Given('que estou no documento {string}', async ({ pageContext }, documento: string) => {
  pageContext.ativarDocumento(documento);
});

// ──────────────────────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────────────────────

Given('que acesso o sistema {string}', async ({ loginPage }, tipoAcesso: string) => {
  await loginPage.acessoSistema(tipoAcesso);
});

When('que efetuo o login utilizando o usuário {string}', async ({ loginPage }, usuario: string) => {
  await loginPage.efetuarLogin(usuario);
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

When('preencho o combobox {string} com {string}', async ({ pageContext }, nome: string, opcao: string) => {
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
  await pageContext.activePage.validarValorCampo(nome, valorEsperado);
});

Then('valido se {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  await pageContext.activePage.validarEstado(nome, estado);
});

Then('valido se checkbox {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  await pageContext.activePage.validarCheckboxEstado(nome, estado);
});

Then('valido que combobox {string} possui opções', async ({ pageContext }, nome: string, dataTable: any) => {
  const opcoes: string[] = dataTable.raw().map((row: string[]) => row[0]);
  await pageContext.activePage.validarOpcoesCombobox(nome, opcoes);
});

Then('valido os campos por label', async ({ pageContext }, dataTable: any) => {
  const linhas = dataTable.hashes();
  await pageContext.activePage.validarCamposPorLabel(linhas);
});

// ──────────────────────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────────────────────

When('pause', async ({ pageContext }) => {
  await pageContext.activePage.pause();
});
