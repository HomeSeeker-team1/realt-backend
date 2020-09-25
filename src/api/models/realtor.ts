import { IRealtor } from '../../interfaces/realtor';

class Realtor {
  private email: string;

  private name: string;

  private surname: string;

  private phone: string;

  private active: boolean;

  private password: string;

  private patronymic: string | undefined;

  private agencyname: string | undefined;

  private address: string | undefined;

  private site: string | undefined;

  constructor(newRealtor: IRealtor, hashedPassword: string) {
    this.email = newRealtor.email;
    this.password = hashedPassword;
    this.name = newRealtor.name;
    this.surname = newRealtor.surname;
    this.phone = newRealtor.phone;
    this.active = false;
    this.patronymic = newRealtor.patronymic;
    this.agencyname = newRealtor.agencyName;
    this.address = newRealtor.address;
    this.site = newRealtor.site;
  }
}

export default Realtor;
