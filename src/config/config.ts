import ambienteInfo from './ambienteInfo.json';

const ENVIRONMENT = 'QA';
const COMPANY_NAC_ID = 'base1';
const COMPANY_INT_ID = 'base2';

export const config = {
  environment: ENVIRONMENT,
  companyNac:  COMPANY_NAC_ID,
  companyInt:  COMPANY_INT_ID,
};

/** Estrutura de ambienteInfo.json: (ambiente qa/hlg) > (companyId > { baseUrl }) */
type AmbienteInfo = Record<string, Record<string, { baseUrl: string }>>;

export function getAmbiente(tipoAcesso: string): { baseUrl: string; companyId: string } {
  let isBaseQA = tipoAcesso.toUpperCase() === 'QA';
  const companyId  = isBaseQA ? config.companyNac : config.companyInt;
  const ambiente    = (ambienteInfo as AmbienteInfo)[config.environment][companyId];

  return { baseUrl: ambiente.baseUrl, companyId };
}