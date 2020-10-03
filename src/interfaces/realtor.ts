export interface IRealtor {
  email: string;
  password: string;
  phone: string;
  agency: boolean;
  name: string;
  surname: string;
  active: boolean;
  address?: string;
  patronymic?: string;
  site?: string;
  agencyName?: string;
  type: string;
}
