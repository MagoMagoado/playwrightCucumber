# Arquitetura do projeto — como as peças se conectam

Este projeto usa Playwright + Cucumber (BDD) com TypeScript. A estrutura foi pensada para separar responsabilidades de forma clara: quem conhece os seletores, quem sabe interagir com a página, e quem descreve o comportamento do teste. Abaixo está a explicação de cada camada e como elas se comunicam.

---

## 1. Elements — o dicionário de seletores

**Arquivos:** `src/elements/commonsElements.ts`, `src/elements/homeElements.ts`

Cada arquivo de elementos é um mapa que associa um nome legível a um seletor CSS (ou a um objeto com opções mais detalhadas). Eles são organizados por categoria:

```ts
BOTAO: {
  'Login': { seletor: '[data-test="login-submit"]' }
},
CAMPO: {
  'Email': '#email'
}
```

A regra fundamental é: **nenhuma page escreve seletor CSS diretamente no código**. Toda interação passa pelo nome mapeado aqui. Isso centraliza a manutenção — se um seletor mudar, basta atualizar em um único lugar.

- `commonsElements.ts` contém os elementos compartilhados por todas as telas (botões de login, campos comuns, menus de navegação).
- Cada tela específica tem seu próprio arquivo (ex: `homeElements.ts`) com os elementos exclusivos daquela página.

**Arquivo:** `src/elements/elementRegistry.ts`

Define apenas os tipos TypeScript (`ElementConfig`, `MapaElementos`). É o "contrato" que garante que todos os arquivos de elementos sigam o mesmo formato. Não contém seletores nem lógica.

---

## 2. CommonsPage — o motor central

**Arquivo:** `src/pages/commonsPage.ts`

É a classe base que todas as pages herdam. Ela carrega os `commonsElements` no construtor e mantém um mapa interno (`elementMap`) com todos os elementos disponíveis para aquela instância.

Responsabilidades principais:

- `carregarElementos(elementos)` — adiciona um conjunto de elementos ao mapa interno. Cada page filha chama esse método no seu construtor para incluir os elementos específicos da sua tela.
- `buscarElemento(categoria, nome)` — busca no mapa pelo nome e categoria, lançando erro se não encontrar.
- `toLocator(config)` — converte o `ElementConfig` (string simples ou objeto com opções) em um locator real do Playwright, aplicando filtros de texto, índice e suporte a iframe quando necessário.
- Métodos de ação genéricos: `clicarBotao`, `preencherCampo`, `selecionarCombobox`, `marcarCheckbox`, `acessarMenuNavegacao`, entre outros.
- Métodos de validação genéricos: `validarMensagem`, `validarEstado`, `validarValorCampo`, `validarOpcoesCombobox`, entre outros.

Qualquer comportamento que se repete em mais de uma tela vive aqui.

---

## 3. Pages filhas — comportamentos específicos de cada tela

**Arquivos:** `src/pages/loginPage.ts`, `src/pages/homePage.ts`

Cada page filha herda `CommonsPage` e no construtor carrega os elementos específicos da sua tela:

```ts
constructor(page: Page) {
  super(page);                           // carrega commonsElements
  this.carregarElementos(homeElementos); // adiciona os elementos específicos desta tela
}
```

A page filha pode:
- Adicionar métodos próprios que só fazem sentido naquela tela (ex: `deslizarSlider` na `HomePage`).
- Sobrescrever (`override`) um método da `CommonsPage` quando a tela tem um comportamento diferente do padrão.

Se um método não for sobrescrito, o comportamento genérico da `CommonsPage` é usado automaticamente.

---

## 4. Fixtures — injeção de dependência e controle de contexto

**Arquivo:** `src/fixtures/fixtures.ts`

No Playwright com BDD, o objeto `page` (que representa o navegador) é gerenciado pelo próprio framework e precisa ser repassado para as classes que vão usá-lo. As fixtures são o mecanismo que faz essa ponte.

O fluxo é:

```
feature → step → fixture injeta { loginPage, homePage, pageContext } → page usa o objeto page do Playwright
```

O `PageContext` resolve um problema específico: os steps genéricos do `commonsSteps` precisam funcionar para qualquer tela, sem saber com antecedência qual está ativa. Em vez de instanciar todas as pages de uma vez, o `PageContext` mantém uma referência à page ativa (`activePage`) e troca ela quando o step `que estou no documento {string}` é chamado.

```
que estou no documento "HOME"  →  pageContext.ativarDocumento('HOME')
                               →  activePage = new HomePage(page)
```

A partir daí, todos os steps genéricos delegam para `pageContext.activePage`, que já é a page correta para aquele cenário.

---

## 5. SetupAPI — preparação de ambiente via API

**Arquivos:** `src/setupAPI/usuarioDados.ts`, `src/setupAPI/usuarioSetup.ts`

Camada responsável por criar e destruir dados de teste diretamente via API, sem passar pela interface. Isso garante um ambiente limpo e previsível antes de cada cenário que dependa de um usuário cadastrado.

**`usuarioDados.ts`** mapeia os dados usados nas requisições, seguindo o mesmo espírito dos arquivos de elements — os dados ficam centralizados e separados da lógica:

```ts
LOGIN_ADMIN: { email: '...', password: '...' },
CREATE_USER: {
  DEFAULT: { first_name: 'Fulano', email: '...', ... }
}
```

**`usuarioSetup.ts`** — classe `UsuarioSetup` com dois métodos:

- `registrar()` — encadeia 3 requisições: `POST /users/register` → `POST /users/login` → `GET /users/me`. Salva o `userId` como atributo privado para uso posterior. Se o registro retornar 409 (usuário já existe), lança erro explícito indicando que o cleanup do cenário anterior pode ter falhado.
- `deletar()` — loga como admin via `POST /users/login` para obter um token com permissão de deleção, depois executa `DELETE /users/{userId}`. O usuário comum não tem permissão para deletar a si mesmo (403), por isso o admin é necessário.

A `baseUrl` é um atributo `private readonly` da classe, resolvida via `getBaseApi()` do `config.ts`.

---

## 6. Hooks — setup e teardown por tag

**Arquivo:** `src/steps/hooks.ts`

Os hooks controlam o que acontece antes e depois de um cenário, sem que isso precise estar descrito no `.feature`. Eles são ativados por tag:

```ts
Before({ tags: '@registrar-fulano-api' }) → usuarioSetup.registrar()
After({ tags: '@registrar-fulano-api' })  → usuarioSetup.deletar()
```

A instância de `UsuarioSetup` é compartilhada entre o `Before` e o `After` intencionalmente — é assim que o `userId` gerado no `registrar()` fica disponível no `deletar()`. Isso funciona corretamente porque os cenários rodam em sequência (1 worker).

A tag pode ser aplicada em um cenário individual ou na `Funcionalidade` inteira. Quando aplicada na `Funcionalidade`, o `Before` e o `After` rodam para **cada cenário** do arquivo — o usuário é criado antes e deletado após cada um.

```gherkin
@registrar-fulano-api
Funcionalidade: Validações de teste   ← aplica o hook em todos os cenários desta feature

  Cenário: Validações Filtro Home     ← Before roda antes, After roda depois
  Cenário: Validações Aba Contact     ← idem
```

---

## 7. Steps — a ponte entre o Gherkin e as pages

**Arquivos:** `src/steps/commonsSteps.ts`, `src/steps/homeSteps.ts`

Os steps traduzem as frases do Gherkin em chamadas de método. Eles **não contêm lógica de negócio nem de interface** — apenas recebem os parâmetros do texto e delegam para a page correspondente:

```ts
When('clico no botão {string}', async ({ pageContext }, nome) => {
  await pageContext.activePage.clicarBotao(nome);
});
```

- `commonsSteps.ts` contém todos os steps reutilizáveis entre telas (login, navegação, ações e validações genéricas).
- Steps específicos de uma tela ficam no arquivo de steps correspondente (ex: `homeSteps.ts`).

O `Given`, `When` e `Then` são importados do `fixtures.ts` — isso é o que permite que os steps recebam as fixtures (como `pageContext` e `loginPage`) diretamente como parâmetros.
