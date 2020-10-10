import { IUserData } from './user';

export interface IOwnerData extends IUserData {
  type: string;
}

export interface IOwner {
  password: string;
  readonly id: string;
  data: IOwnerData;
}
