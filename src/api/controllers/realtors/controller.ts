import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IRealtor, IRealtorData } from '../../../interfaces/users/realtor';
import databaseSqlQuery from '../../database-utils';
import Realtor from '../../models/Users/Realtor';

const realtors = {
  createRealtor: async (newRealtor: IRealtorData): Promise<string | never> => {
    try {
      const hashedPassword = await bcrypt.hash(newRealtor.password, 12);
      const id = uuidv4();
      const realtor = new Realtor(newRealtor);
      const newRealtorJSON = JSON.stringify(realtor);
      const query = `INSERT INTO realtors (id, data, password) VALUES ('${id}', '${newRealtorJSON}', '${hashedPassword}');`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return id;
      }
      throw Error;
    } catch (error) {
      throw new Error(error);
    }
  },

  findRealtor: async (email: string): Promise<false | IRealtor | never> => {
    try {
      const query = `SELECT * FROM realtors WHERE data ->> 'email' = '${email}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  findRealtorById: async (id: string): Promise<false | IRealtor | never> => {
    try {
      const query = `SELECT * FROM realtors WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateRealtor: async (
    updatedData: IRealtorData,
    id: string,
  ): Promise<boolean | never> => {
    try {
      const updatedDataJson = JSON.stringify(updatedData);
      const query = `UPDATE realtors SET data = '${updatedDataJson}' WHERE id = '${id}'`;
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

export default realtors;
