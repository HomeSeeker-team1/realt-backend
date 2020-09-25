import { IOwner } from '../../interfaces/owner';

class Owner {
  private email: string;

  private name: string;

  private surname: string;

  private patronymic: string | undefined;

  private phone: string;

  private active: boolean;

  private password: string;

  constructor(newOwner: IOwner, hashedPassword: string) {
    this.email = newOwner.email;
    this.password = hashedPassword;
    this.name = newOwner.name;
    this.surname = newOwner.surname;
    this.patronymic = newOwner.patronymic;
    this.phone = newOwner.phone;
    this.active = false;
  }
}

export default Owner;
