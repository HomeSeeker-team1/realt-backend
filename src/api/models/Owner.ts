import { IOwnerData } from '../../interfaces/owner';
import MEMBERS from '../../constants/members/members';
import User from './User';

class Owner extends User {
  private type: string;

  constructor(newOwner: IOwnerData) {
    super(newOwner);
    this.type = MEMBERS.OWNER;
  }
}

export default Owner;
