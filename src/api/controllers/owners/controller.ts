import { v4 as uuidv4 } from 'uuid';
import { IOwner } from '../../../models/owner';
import databaseSqlQuery from '../../database-utils';

const owners = {
  createOwner: async ({ email, hashedPassword }: IOwner) => {
    try {
      const id = uuidv4();
      const query = `Insert into owners(id, email, password) Values ('${id}', '${email}', '${hashedPassword}')`;
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
      const query = `select id from owners WHERE email = '${email}'`;
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
