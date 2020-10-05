import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IOwner, IOwnerData } from '../../../interfaces/owner';
import databaseSqlQuery from '../../database-utils';
import Owner from '../../models/Owner';

const owners = {
  createOwner: async (newOwner: IOwnerData): Promise<string | never> => {
    try {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(newOwner.password, 12);
      const owner = new Owner(newOwner);
      const newOwnerJSON = JSON.stringify(owner);
      const query = `INSERT INTO owners (id, data, password) VALUES ('${id}', '${newOwnerJSON}', '${hashedPassword}');`;
      const res = await databaseSqlQuery(query);

      if (res.rowCount === 1) {
        return id;
      }
      throw Error;
    } catch (error) {
      throw new Error(error);
    }
  },

  findOwner: async (email: string): Promise<false | IOwner | never> => {
    try {
      const query = `SELECT * FROM owners WHERE data ->> 'email' = '${email}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  findOwnerById: async (id: string): Promise<false | IOwner | never> => {
    try {
      const query = `SELECT * FROM owners WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }

      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateOwner: async (
    updatedData: IOwnerData,
    id: string,
  ): Promise<boolean | never> => {
    try {
      const updatedDataJson = JSON.stringify(updatedData);
      const query = `UPDATE owners SET data = '${updatedDataJson}' WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default owners;
