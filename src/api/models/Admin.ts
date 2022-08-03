import { IAdminData } from '../../interfaces/users/admin';
import MEMBERS from '../../constants/members/members';

class Admin {
  private type: string;

  private email: string | undefined;

  private name: string | undefined;

  private active: boolean | undefined;

  constructor(newAdmin: IAdminData) {
    this.type = MEMBERS.ADMIN;
    this.email = newAdmin.email;
    this.name = newAdmin.name;
    this.active = newAdmin.active || false;
  }
}

export default Admin;
