import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IRealtor } from '../../../interfaces/realtor';
import databaseSqlQuery from '../../database-utils';
import Realtor from '../../models/Realtor';

const realtors = {
  createRealtor: async (newRealtor: IRealtor) => {
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
      throw Error;
    }
  },

  findRealtor: async (email: string) => {
    try {
      const query = `SELECT * FROM realtors WHERE data ->> 'email' = '${email}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }
      return false;
    } catch (error) {
      throw Error;
    }
  },

  findRealtorById: async (id: string) => {
    try {
      const query = `SELECT * FROM realtors WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }
      return false;
    } catch (error) {
      throw Error;
    }
  },

  updateRealtor: async (updatedData: IRealtor, id: string) => {
    try {
      const updatedDataJson = JSON.stringify(updatedData);
      const query = `UPDATE realtors SET data = '${updatedDataJson}' WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw Error;
    }
  },
};

export default realtors;
