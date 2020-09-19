import { v4 as uuidv4 } from 'uuid';
import { IRealtor } from '../../../models/realtors';
import databaseSqlQuery from '../../database-utils';

const realtors = {
  createCandidate: async ({ email, password, isAgency }: IRealtor) => {
    try {
      const id = uuidv4();
      const query = `Insert into candidates(id, email, password, agency) Values ('${id}', '${email}', '${password}', '${isAgency}')`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return id;
      }
      throw Error;
    } catch (error) {
      throw Error;
    }
  },
  findCandidate: async (email: string) => {
    try {
      const query = `select email from candidates WHERE email = '${email}'`;
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
