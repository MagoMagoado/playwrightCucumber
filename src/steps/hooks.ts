import { Before, After } from '@fixtures/fixtures';
import { UsuarioSetup } from '@setupAPI/usuarioSetup';

// Instância compartilhada entre Before e After para que token e userId
// gerados no registrar() estejam disponíveis no deletar(). Funciona
// corretamente porque os cenários rodam em sequência (1 worker).
const usuarioSetup = new UsuarioSetup();

Before({ tags: '@registrar-fulano-api' }, async () => {
  await usuarioSetup.registrar();
});

After({ tags: '@registrar-fulano-api' }, async () => {
  await usuarioSetup.deletar();
});
