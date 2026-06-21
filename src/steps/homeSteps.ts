import { When } from '@fixtures/fixtures';

When('que deslizo o slider {string} para mínimo {string} e máximo {string}', async ({ homePage }, nome: string, valorMin: string, valorMax: string) => {
  await homePage.deslizarSlider(nome, valorMin, valorMax);
});

