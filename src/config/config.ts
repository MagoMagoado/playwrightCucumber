import ambienteInfo from './ambienteInfo.json';

const base1 = 'base1';
const base2 = 'base2';

/** Estrutura de ambienteInfo.json: (ambiente qa/hlg) > (companyId > { baseUrl }) */
type AmbienteInfo = Record<string, Record<string, { baseUrl: string }>>;

export function getAmbiente(tipoAcesso: string): { baseUrl: string; companyId: string } {
  let companyId: string;

  if (tipoAcesso === 'QA' || tipoAcesso === 'saucedemo') {
    companyId = base1;
  } else {
    companyId = base2;
  }

  const ambiente = (ambienteInfo as AmbienteInfo)[tipoAcesso][companyId];
  return { baseUrl: ambiente.baseUrl, companyId };
}