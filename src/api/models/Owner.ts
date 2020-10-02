import { IOwner } from '../../interfaces/owner';
import MEMBERS from '../../constants/members/members';

class Owner {
  private email: string;

  private name: string;

  private surname: string;

  private patronymic: string | undefined;

  private phone: string;

  private active: boolean;

  private type: string;

  constructor(newOwner: IOwner) {
    this.email = newOwner.email;
    this.name = newOwner.name;
    this.surname = newOwner.surname;
    this.patronymic = newOwner.patronymic;
    this.phone = newOwner.phone;
    this.active = newOwner.active || false;
    this.type = MEMBERS.OWNER;
  }
}

export default Owner;
