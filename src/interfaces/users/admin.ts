import { IUserData } from './user';

interface IKeyDataCandidate {
  key: string;
  id: string;
}

export interface IAdminData extends IUserData {
  type: string;
  keyDataCandidate?: IKeyDataCandidate;
}

export interface IAdmin {
  password: string;
  readonly id: string;
  data: IAdminData;
}
