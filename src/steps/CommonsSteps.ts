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

Given('desregistro os Service Workers', async ({ loginPage }) => {
  await loginPage.desregistrarServiceWorkers();
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
  await pageContext.activePage.acessarMenuNavegacao(caminho);
});

// ──────────────────────────────────────────────────────────────
// Ações
// ──────────────────────────────────────────────────────────────

When('clico no botão {string}', async ({ pageContext }, nome: string) => {
  await pageContext.activePage.clicarBotao(nome);
});

When('preencho os campos', async ({ pageContext }, dataTable: any) => {
  await pageContext.activePage.preencherCampos(dataTable.hashes());
});

When('preencho o campo {string} com {string}', async ({ pageContext }, nome: string, valor: string) => {
  await pageContext.activePage.preencherCampo(nome, valor);
});

When('preencho o combobox {string} com {string}', async ({ pageContext }, nome: string, opcao: string) => {
  await pageContext.activePage.selecionarCombobox(nome, opcao);
});

When('{string} o checkbox {string}', async ({ pageContext }, acao: string, nome: string) => {
  await pageContext.activePage.marcarCheckbox(acao, nome);
});

// ──────────────────────────────────────────────────────────────
// Validações
// ──────────────────────────────────────────────────────────────

Then('valido se {string} {string} com mensagem {string}', async ({ pageContext }, estado: string, tipo: string, mensagem: string) => {
  // estado: VISUALIZO ou NAO VISUALIZO
  await pageContext.activePage.validarMensagem(estado, tipo, mensagem);
});

Then('valido se {string} {string} dentro de {string}', async ({ pageContext }, estado: string, nome: string, container: string) => {
  // estado: VISUALIZO ou NAO VISUALIZO / container: nome do elemento pai ou "TELA" para buscar em tudo
  await pageContext.activePage.validarVisibilidade(estado, nome, container);
});

Then('valido se {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  // estado: HABILITADO ou DESABILITADO
  await pageContext.activePage.validarEstado(nome, estado);
});

Then('valido se checkbox {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  // estado: MARCADO ou DESMARCADO
  await pageContext.activePage.validarCheckboxEstado(nome, estado);
});

Then('valido o combobox {string} com opções', async ({ pageContext }, nome: string, dataTable: any) => {
  await pageContext.activePage.validarOpcoesCombobox(nome, dataTable.hashes());
});

Then('valido o campo {string} com valor {string}', async ({ pageContext }, nome: string, valorEsperado: string) => {
  await pageContext.activePage.validarValorCampo(nome, valorEsperado);
});

Then('valido os campos por label', async ({ pageContext }, dataTable: any) => {
  const linhas = dataTable.hashes();
  await pageContext.activePage.validarCamposPorLabel(linhas);
});

// STEP ESPECÍFICO PARA OVERRIDE HomePage. Teste para verificar se acessa corretamente método
Then('valido que {string} co2 tem categoria {string}', async ({ pageContext }, nome: string, categoria: string) => {
  await pageContext.activePage.validarCategoriaProduto(nome, categoria);
});

// ──────────────────────────────────────────────────────────────
// API Tests
// ──────────────────────────────────────────────────────────────

Then('valido se endpoint {string} retorna sucesso', async ({ pageContext }, nome: string) => {
  await pageContext.activePage.validarEndpointRetornaSucesso(nome);
});

Then('valido se endpoint {string} contém em {string} valores', async ({ pageContext }, nome: string, chave: string, dataTable: any) => {
  const valores: string[] = dataTable.raw().flat().map((v: string) => v.trim());
  await pageContext.activePage.validarEndpointContemValores(nome, chave, valores);
});

// ──────────────────────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────────────────────

When('pause', async ({ pageContext }) => {
  await pageContext.activePage.pause();
});