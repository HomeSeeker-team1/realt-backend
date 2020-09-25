import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IRealtor } from '../../../interfaces/realtor';
import databaseSqlQuery from '../../database-utils';
import Realtor from '../../models/realtor';

const realtors = {
  createRealtor: async (newRealtor: IRealtor) => {
    try {
      const hashedPassword = await bcrypt.hash(newRealtor.password, 12);
      const id = uuidv4();
      const realtor = new Realtor(newRealtor, hashedPassword);
      const newRealtorJSON = JSON.stringify(realtor);
      const query = `INSERT INTO realtors (id, data) VALUES ('${id}', '${newRealtorJSON}');`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return id;
      }
      throw Error;
    } catch (error) {
      console.log('create realtor', error);
      throw Error;
    }
  },
  findRealtor: async (email: string) => {
    try {
      const query = `SELECT id FROM realtors WHERE data ->> 'email' = '${email}'`;
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

export default realtors;
