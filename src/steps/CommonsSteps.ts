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

Then('{string} {string} com a mensagem {string}', async ({ pageContext }, estado: string, tipo: string, mensagem: string) => {
  // estado: VISUALIZO ou NAO VISUALIZO
  await pageContext.activePage.validarMensagem(estado, tipo, mensagem);
});

Then('valido se {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  // estado: HABILITADO ou DESABILITADO
  await pageContext.activePage.validarEstado(nome, estado);
});

Then('valido se checkbox {string} está {string}', async ({ pageContext }, nome: string, estado: string) => {
  // estado: MARCADO ou DESMARCADO
  await pageContext.activePage.validarCheckboxEstado(nome, estado);
});

Then('valido que combobox {string} possui opções', async ({ pageContext }, nome: string, dataTable: any) => {
  await pageContext.activePage.validarOpcoesCombobox(nome, dataTable.hashes());
});

Then('valido os campos por label', async ({ pageContext }, dataTable: any) => {
  const linhas = dataTable.hashes();
  await pageContext.activePage.validarCamposPorLabel(linhas);
});

Then('o campo {string} deve conter o valor {string}', async ({ pageContext }, nome: string, valorEsperado: string) => {
  await pageContext.activePage.validarValorCampo(nome, valorEsperado);
});

// STEP ESPECÍFICO PARA HomePage. Teste para verificar se acessa corretamente método
Then('valido que {string} co2 tem categoria {string}', async ({ pageContext }, nome: string, categoria: string) => {
  await pageContext.activePage.validarCategoriaProduto(nome, categoria);
});

// ──────────────────────────────────────────────────────────────
// API Tests
// ──────────────────────────────────────────────────────────────

Then('valido que endpoint foi chamado', async ({ request }) => {
  const response = await request.get('https://api.practicesoftwaretesting.com/users/me')
  const responseObject = await await response.json()
  console.log(responseObject)
  // ABA CALL
  // Time
  // start:
  // 6.1s
  // duration:
  // 710ms
  // Parameters
  // url:
  // "https://api.practicesoftwaretesting.com/users/me"
  // method:
  // "GET"
  // timeout:
  // 0
  // Return value
  // {"url":"https://api.practicesoftwaretesting.com/users/me","status":401,"statusText":"Unauthorized","headers":[{"name":"Date","value":"Tue, 23 Jun 2026 15:25:57 GMT"},{"name":"Server","value":"Apache/2.4.52 (Ubuntu)"},{"name":"Cache-Control","value":"no-cache, private"},{"name":"Access-Control-Allow-Origin","value":"*"},{"name":"Access-Control-Expose-Headers","value":"Content-Disposition"},{"name":"Upgrade","value":"h2"},{"name":"Connection","value":"Upgrade, close"},{"name":"Transfer-Encoding","value":"chunked"},{"name":"Content-Type","value":"application/json"}],"fetchUid":"1b97e97c33c89260d91fce4b6d206192"}
});

// ──────────────────────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────────────────────

When('pause', async ({ pageContext }) => {
  await pageContext.activePage.pause();
});
