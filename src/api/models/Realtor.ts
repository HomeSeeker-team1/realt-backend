import { IRealtor } from '../../interfaces/realtor';
import MEMBERS from '../../constants/members/members';

class Realtor {
  private email: string;

  private name: string;

  private surname: string;

  private phone: string;

  private active: boolean;

  private type: string;

  private patronymic: string | undefined;

  private agencyname: string | undefined;

  private address: string | undefined;

  private site: string | undefined;

  constructor(newRealtor: IRealtor) {
    this.email = newRealtor.email;
    this.name = newRealtor.name;
    this.surname = newRealtor.surname;
    this.phone = newRealtor.phone;
    this.active = newRealtor.active || false;
    this.patronymic = newRealtor.patronymic;
    this.agencyname = newRealtor.agencyName;
    this.address = newRealtor.address;
    this.site = newRealtor.site;
    this.type = MEMBERS.REALTOR;
  }
}

export default Realtor;
