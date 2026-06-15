type ElementoOpcoes = {
  seletor: string;
  index?: number;
  waitAfter?: 'networkidle' | 'loader' | 'navigation' | 'login';
  waitBefore?: 'networkidle' | 'loader' | 'navigation' | 'login';
  texto?: string;
  exact?: boolean;
};

/**
 * @param ElementConfig diz que pode ser só uma string normal para mapear ou pode usar das opções acima
 * @param MapaElementos  {CATEGORIA > (NOMEMAPEADO > opcoes mapeamento ou mapeamento simples)}
 EXEMPLO:
  BOTAO: {
    'Entrar': '#submit-btn',       // ElementConfig = string
    'Filtro: Adicionar': { seletor: '...', waitAfter: 'loader' }  // ElementConfig = objeto
  },
*/
export type ElementConfig = string | ElementoOpcoes;
export type MapaElementos = Record<string, Record<string, ElementConfig>>;
