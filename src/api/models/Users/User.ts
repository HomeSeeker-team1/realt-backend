import { IUserData } from '../../../interfaces/users/user';

class User {
  private email: string;

  private name: string;

  private surname: string;

  private patronymic: string | undefined;

  private phone: string;

  private active: boolean;

  constructor(newUser: IUserData) {
    this.email = newUser.email;
    this.name = newUser.name;
    this.surname = newUser.surname;
    this.patronymic = newUser.patronymic;
    this.phone = newUser.phone;
    this.active = newUser.active || false;
  }
}

export default User;
