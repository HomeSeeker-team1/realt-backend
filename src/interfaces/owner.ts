export interface IOwner {
  email: string;
  password: string;
  phone: string;
  name: string;
  surname: string;
  patronymic?: string;
  agency: boolean;
  active: boolean;
  agencyName?: string;
  address?: string;
  site?: string;
}
