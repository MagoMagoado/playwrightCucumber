import { type Page } from '@playwright/test';
import { CommonsPage } from './CommonsPage';
import { getAmbiente } from '@config/config';
import loginInfo from '@config/loginInfo.json';

type LoginInfo = {
  username: string;
  password: string;
};

/**
   * @param userId - LOGIN_1
   * @param constructor - ao criar a instância, chama carregarElementos(commonsElementos),
   *                      carregando os elementos comuns a todos os testes                            para adicionar seus elementos específicos ao mapa
*/
function getUser(userId: string): LoginInfo {
  const user = (loginInfo as Record<string, LoginInfo>)[userId];
  if (!user) throw new Error(`Usuário "${userId}" não encontrado em users.json`);
  return user;
}

export class LoginPage extends CommonsPage {
  constructor(page: Page) {
    super(page);
  }

  async efetuarLogin(tipoLogin: string, usuarioId: string): Promise<void> {
    const user = getUser(usuarioId);
    const { baseUrl, companyId } = getAmbiente(tipoLogin);

    await this.page.goto(`${baseUrl}/module-selection/${companyId}/login`);

    await this.preencherCampo('Email', user.username);
    await this.preencherCampo('Password', user.password);
    await this.clicarBotao('Login');
    await this.aguardarCarregamentoPagina('login');
  }
}
