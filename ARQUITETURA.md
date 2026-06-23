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

## 5. Steps — a ponte entre o Gherkin e as pages

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
