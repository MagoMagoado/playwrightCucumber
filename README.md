# Playwright Cucumber

Projeto de automação de testes E2E usando Playwright + Cucumber (BDD), escrito em TypeScript.

---

## Estrutura de pastas

```
src/
  elements/       # Mapeamento de seletores por página
  fixtures/       # Configuração dos fixtures e PageContext
  pages/          # Classes de página (CommonsPage e filhas)
  setupAPI/       # Dados e lógica de setup/teardown via API
  steps/          # Definições de steps Cucumber e hooks
features/         # Arquivos .feature com os cenários em português
```

---

## Como funciona

### Fluxo de execução

1. O cenário no `.feature` descreve os passos em português
2. Cada passo é capturado por um step em `CommonsSteps.ts` ou em um arquivo de steps específico
3. Os steps delegam para `pageContext.activePage`, que executa o comportamento correto
4. O step `"que estou no documento"` troca a page ativa via `ativarDocumento()`

### PageContext (`fixtures.ts`)

Controla qual page está ativa no cenário. Todas as pages são registradas como fábricas — só são instanciadas quando `ativarDocumento()` é chamado.

```typescript
// Antes de ativar: activePage = CommonsPage (base)
// Depois do step "que estou no documento 'HOME'": activePage = HomePage
```

### Pages (`src/pages/`)

- **`CommonsPage`** — classe base com todos os métodos de ação e validação genéricos
- Pages filhas estendem `CommonsPage`, carregam seus próprios elementos e podem sobrescrever métodos via `override`

### Elements (`src/elements/`)

Cada page tem seu arquivo de elementos. Os elementos são organizados por categoria:

```typescript
BOTAO: { 'Nome do botão': '#seletor-css' }
CAMPO: { 'Nome do campo': { seletor: '...', texto: '...', exact: true } }
COMBOBOX, CHECKBOX, VALIDACAO, MENUS_NAVEGACAO, ENDPOINT, SLIDER
```

`commonsElements.ts` contém elementos compartilhados por todas as páginas e é carregado automaticamente pelo constructor de `CommonsPage`.

### SetupAPI (`src/setupAPI/`)

Cria e destrói dados de teste via API, sem passar pela interface. Composto por:

- **`usuarioDados.ts`** — dados centralizados usados nas requisições (credenciais, payload de criação de usuário)
- **`usuarioSetup.ts`** — classe `UsuarioSetup` com os métodos `registrar()` e `deletar()`

### Hooks (`src/steps/hooks.ts`)

Controlam setup e teardown por tag, sem que isso precise estar no `.feature`. A tag `@registrar-fulano-api` ativa o `Before` (registrar usuário) e o `After` (deletar usuário). Quando aplicada na `Funcionalidade`, vale para todos os cenários do arquivo.

```gherkin
@registrar-fulano-api
Funcionalidade: Validações de teste  ← Before/After rodam em cada cenário desta feature
```

---

## Como adicionar uma nova página

### 1. Criar o arquivo de elementos (se necessário)
Em `src/elements/`, crie `novaPageElements.ts` seguindo o padrão de `homeElements.ts`.

### 2. Criar a Page
Em `src/pages/`, crie `novaPage.ts`:

```typescript
import { type Page } from '@playwright/test';
import { CommonsPage } from './CommonsPage';
import { novaPageElementos } from '@elements/novaPageElements';

export class NovaPage extends CommonsPage {
  constructor(page: Page) {
    super(page);
    this.carregarElementos(novaPageElementos);
  }

  // métodos próprios ou overrides aqui
}
```

### 3. Registrar no PageContext (`fixtures.ts`)
```typescript
// No mapa pages do constructor:
['NOVA_PAGE', () => new NovaPage(page)],

// No type Fixtures:
novaPage: NovaPage;

// No base.extend:
novaPage: async ({ pageContext }, use) => {
  pageContext.ativarDocumento('NOVA_PAGE');
  await use(pageContext.activePage as NovaPage);
},
```

### 4. Criar o arquivo de steps (se tiver steps próprios)
Em `src/steps/`, crie `NovaPageSteps.ts`:

```typescript
import { When, Then } from '@fixtures/fixtures';

When('executo ação específica', ({ novaPage }) => {
  novaPage.metodoEspecifico();
});
```

### 5. Usar no `.feature`
```gherkin
E que estou no documento "NOVA_PAGE"
Quando executo ação específica
```

---
## para Posteriormente

cucumber html report
