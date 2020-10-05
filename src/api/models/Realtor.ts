import { IRealtorData } from '../../interfaces/realtor';
import MEMBERS from '../../constants/members/members';
import User from './User';

class Realtor extends User {
  private type: string;

  private agencyname: string | undefined;

  private address: string | undefined;

  private site: string | undefined;

  constructor(newRealtor: IRealtorData) {
    super(newRealtor);
    this.agencyname = newRealtor.agencyName;
    this.address = newRealtor.address;
    this.site = newRealtor.site;
    this.type = MEMBERS.REALTOR;
  }
}

export default Realtor;
