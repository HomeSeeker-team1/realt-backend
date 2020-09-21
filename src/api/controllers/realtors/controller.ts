import { v4 as uuidv4 } from 'uuid';
import { IRealtor } from '../../../models/realtor';
import databaseSqlQuery from '../../database-utils';

const realtors = {
  createCandidate: async ({ email, hashedPassword, agency }: IRealtor) => {
    try {
      const id = uuidv4();
      const query = `Insert into candidates(id, email, password, agency) Values ('${id}', '${email}', '${hashedPassword}', '${agency}')`;
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
      const query = `select id from candidates WHERE email = '${email}'`;
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
  findRealtor: async (email: string) => {
    try {
      const query = `select email from realtors WHERE email = '${email}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw Error;
    }
  },
  transferCandidateToRealtors: async (id: string) => {
    try {
      const copyCandidateToRealtor = `INSERT INTO realtors SELECT * FROM candidates WHERE id = '${id}'`;
      const deleteCandidate = `DELETE FROM candidates WHERE id = '${id}'`;
      await databaseSqlQuery(copyCandidateToRealtor);
      await databaseSqlQuery(deleteCandidate);
    } catch (error) {
      throw Error;
    }
  },
};

export default realtors;
