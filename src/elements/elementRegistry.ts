import { type MapaElementos } from '@pages/CommonsPage';
import { camposExtrasElementos } from './camposExtrasElements';

// Mapeia o nome do documento (usado no step "que estou no documento") para seus elementos.
export const REGISTRO_DOCUMENTOS: Record<string, MapaElementos> = {
  'CAMPOS_EXTRAS_PAG': camposExtrasElementos,
};