import { type Page } from '@playwright/test';
import { CommonsPage } from './commonsPage';
import { getAmbiente } from '@config/config';
import loginInfo from '@config/loginInfo.json';

type LoginInfo = {
  username: string;
  password: string;
};

function getUser(userId: string): LoginInfo {
  const user = (loginInfo as Record<string, LoginInfo>)[userId];
  if (!user) throw new Error(`Usuário "${userId}" não encontrado em users.json`);
  return user;
}

export class LoginPage extends CommonsPage {
  constructor(page: Page) {
    super(page);
  }

  async acessoSistema(tipoLogin: string): Promise<void> {
    const { baseUrl, companyId } = getAmbiente(tipoLogin);
    await this.page.goto(`${baseUrl}`);
  }

  async efetuarLogin(usuarioId: string): Promise<void> {
    const user = getUser(usuarioId);
    let usuarioSauce = usuarioId === 'User Sauce';
    const email = usuarioSauce ? 'Sauce: Username' : 'Email';
    await this.preencherCampo(email, user.username);
    await this.preencherCampo('Password', user.password);
    await this.clicarBotao('Login');
    await this.aguardarCarregamentoPagina('login');
  }

  async desregistrarServiceWorkers(): Promise<void> {
    await this.page.route('https://events.backtrace.io/**', route => route.fulfill({ status: 200, body: '{}' }));
    await this.page.evaluate(async () => {
      if (!navigator?.serviceWorker) return;
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(r => r.unregister()));
    });
  }
}
