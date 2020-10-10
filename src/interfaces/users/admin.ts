import { IUserData } from './user';

export interface IAdminData extends IUserData {
  type: string;
  key?: string;
}

export interface IAdmin {
  password: string;
  readonly id: string;
  data: IAdminData;
}
