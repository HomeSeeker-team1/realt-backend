import { IOwner } from '../../interfaces/owner';
import MEMBERS from '../../constants/members/members';

class Owner {
  private email: string;

  private name: string;

  private surname: string;

  private patronymic: string | undefined;

  private phone: string;

  private active: boolean;

  private password: string | undefined;

  private type: string;

  constructor(newOwner: IOwner, hashedPassword: string | null = null) {
    this.email = newOwner.email;
    this.name = newOwner.name;
    this.surname = newOwner.surname;
    this.patronymic = newOwner.patronymic;
    this.phone = newOwner.phone;
    this.active = false;
    this.type = MEMBERS.OWNER;
    if (hashedPassword) {
      this.password = hashedPassword;
    }
  }
}

export default Owner;
