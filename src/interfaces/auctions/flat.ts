import { TAddress } from './address';
import { TFlatTechnicalSpecifications } from './ technicalSpecifications/flatTechnicalSpecifications';
import { TFlatLegalIssues } from './legalIssues/flatLegalIssues';

export interface IFlat {
  address: TAddress;
  technicalSpec: TFlatTechnicalSpecifications;
  legalIssues: TFlatLegalIssues;
}
