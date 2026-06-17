import ambienteInfo from './ambienteInfo.json';

const ENVIRONMENT = 'qa';
const COMPANY_NAC = 'base1';
const COMPANY_INT = 'base2';

export const config = {
  environment: ENVIRONMENT,
  companyNac:  COMPANY_NAC,
  companyInt:  COMPANY_INT,
};

/** Estrutura de ambienteInfo.json: (ambiente qa/hlg) > (companyId > { baseUrl }) */
type AmbienteInfo = Record<string, Record<string, { baseUrl: string }>>;

export function getAmbiente(tipoLogin: string): { baseUrl: string; companyId: string } {
  const isNacional = tipoLogin.toUpperCase() === 'NACIONAL';
  const companyId  = isNacional ? config.companyNac : config.companyInt;
  const ambiente    = (ambienteInfo as AmbienteInfo)[config.environment][companyId];

  return { baseUrl: ambiente.baseUrl, companyId };
}