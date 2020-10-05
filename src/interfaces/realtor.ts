import { IUserData } from './user';

export interface IRealtorData extends IUserData {
  agency: boolean;
  address?: string;
  site?: string;
  agencyName?: string;
  type: string;
}

export interface IRealtor {
  password: string;
  readonly id: string;
  data: IRealtorData;
}
