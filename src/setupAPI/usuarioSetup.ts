import { request } from '@playwright/test';
import { getBaseApi } from '@config/config';
import { usuarioDados } from './usuarioDados';

export class UsuarioSetup {
  private readonly baseUrl = getBaseApi('ToolShop');
  private userId: string | null = null;

  async registrar(): Promise<void> {
    const usuario = usuarioDados.CREATE_USER.DEFAULT;
    const context = await request.newContext();

    const registerResponse = await context.post(`${this.baseUrl}/users/register`, {
      data: usuario,
    });
    if (registerResponse.status() === 409) {
      const body = await registerResponse.json();
      await context.dispose();
      throw new Error(`[setupAPI] Usuário "${usuario.email}" já existe — verifique se o After hook executou corretamente no cenário anterior\nResponse: ${JSON.stringify(body)}`);
    } else if (registerResponse.ok()) {
      console.log(`[setupAPI] Usuário "${usuario.email}" registrado com sucesso.`);
    }

    const loginResponse = await context.post(`${this.baseUrl}/users/login`, {
      data: { email: usuario.email, password: usuario.password },
    });
    if (!loginResponse.ok()) {
      await context.dispose();
      throw new Error(`[setupAPI] Falha no login de "${usuario.email}". Status: ${loginResponse.status()}`);
    }

    const { access_token } = await loginResponse.json();

    const meResponse = await context.get(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!meResponse.ok()) {
      await context.dispose();
      throw new Error(`[setupAPI] Falha ao buscar dados do usuário. Status: ${meResponse.status()}`);
    }

    this.userId = (await meResponse.json()).id;
    console.log(`[setupAPI] Login realizado. userId: ${this.userId}`);

    await context.dispose();
  }

  async deletar(): Promise<void> {
    if (!this.userId) {
      console.warn('[setupAPI] Não foi possível deletar: userId ausente.');
      return;
    }

    const context = await request.newContext();

    // LOGIN COM USUÁRIO ADM PARA DELETE
    const loginAdminResponse = await context.post(`${this.baseUrl}/users/login`, {
      data: usuarioDados.LOGIN_ADMIN,
    });
    if (!loginAdminResponse.ok()) {
      await context.dispose();
      throw new Error(`[setupAPI] Falha no login do admin. Status: ${loginAdminResponse.status()}`);
    }

    /**
     * @param adminToken - equivale a estrutura:
     * const response = await loginAdminResponse.json();
     * const adminToken = response.access_token;
    */
    const { access_token: adminToken } = await loginAdminResponse.json();

    // DELETANDO USUÁRIO PELO ID
    const deleteResponse = await context.delete(`${this.baseUrl}/users/${this.userId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (deleteResponse.ok()) {
      console.log(`[setupAPI] Usuário "${this.userId}" deletado com sucesso.`);
    } else {
      console.warn(`[setupAPI] Falha ao deletar usuário "${this.userId}". Status: ${deleteResponse.status()}`);
    }

    await context.dispose();

    this.userId = null;
  }
}
