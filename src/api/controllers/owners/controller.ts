import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IOwner } from '../../../interfaces/owner';
import databaseSqlQuery from '../../database-utils';
import Owner from '../../models/owner';

const owners = {
  createOwner: async (newOwner: IOwner) => {
    try {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(newOwner.password, 12);
      const owner = new Owner(newOwner, hashedPassword);
      const newOwnerJSON = JSON.stringify(owner);
      const query = `INSERT INTO owners (id, data) VALUES ('${id}', '${newOwnerJSON}');`;
      const res = await databaseSqlQuery(query);

      if (res.rowCount === 1) {
        return id;
      }
      throw Error;
    } catch (error) {
      throw Error;
    }
  },
  findOwner: async (email: string) => {
    try {
      const query = `SELECT * FROM owners WHERE data ->> 'email' = '${email}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        const { id } = res.rows[0];
        return id;
      }
      return false;
    } catch (error) {
      throw Error;
    }
  },
};

export default owners;
