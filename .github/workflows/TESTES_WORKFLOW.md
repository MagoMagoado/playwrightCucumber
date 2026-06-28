# Workflow: Testes Playwright

Arquivo de configuração: `.github/workflows/testes.yml`

## Gatilhos

- **Push para `master`** — executa automaticamente a cada novo push na branch master
- **`workflow_dispatch`** — pode ser disparado manualmente pelo botão "Run workflow" na aba Actions do GitHub

## Job: `testes`

Roda em uma máquina virtual `ubuntu-latest`.

| Passo | O que faz |
|---|---|
| **Checkout do código** | Baixa o código do repositório na máquina do GitHub Actions |
| **Configurar Node.js** | Instala o Node.js versão 20 com cache do npm (acelera builds futuras) |
| **Instalar dependências** | Roda `npm ci` — instala exatamente o que está no `package-lock.json` |
| **Instalar Chromium do Playwright** | Baixa o binário do Chromium com suas dependências de sistema (`--with-deps`) |
| **Rodar testes** | Roda `npm run test:ci/cd` com `CI=true` — exclui testes marcados com `@local` e ativa o reporter do GitHub |
| **Publicar relatório** | Faz upload da pasta `playwright-report/` como artefato, guardado por 15 dias |

## Artefatos

O upload do relatório usa `if: always()` — é salvo mesmo que os testes falhem — e `if-no-files-found: ignore` não está configurado, então gera erro se a pasta estiver vazia.

Ficam disponíveis na aba **Actions** do repositório no GitHub para download após cada execução.

| Artefato | Conteúdo |
|---|---|
| `playwright-report` | Relatório HTML completo da execução dos testes |

## Summary no GitHub Actions

O `playwright.config.ts` está configurado para usar o reporter `github` quando `CI=true`:

```ts
reporter: process.env.CI
  ? [['github'], ['html', { open: 'never' }]]
  : [['list']],
```

Isso gera automaticamente anotações inline nos commits (marcando falhas diretamente no código) e um summary na aba **Summary** de cada execução no GitHub Actions.
