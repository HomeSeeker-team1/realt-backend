import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { IAdmin, IAdminData } from '../../../interfaces/users/admin';
import databaseSqlQuery from '../../database-utils';
import Admin from '../../models/Admin';

const admins = {
  createAdmin: async (newAdmin: IAdminData): Promise<string | never> => {
    try {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(newAdmin.password, 12);
      if (!newAdmin.key) throw Error('отсутствует ключ');
      // uncomment 16,  delete 17
      // const hashedKey = await bcrypt.hash(newAdmin.key, 12);
      const hashedKey = newAdmin.key;

      const admin = new Admin(newAdmin);
      const newAdminJSON = JSON.stringify(admin);

      const query = `INSERT INTO admins (id, data, password) VALUES ('${id}', '${newAdminJSON}', '${hashedPassword}');`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount !== 1) {
        throw Error(
          `ошибка по запросу INSERT INTO admins (id, data, password) VALUES ('${id}', '${newAdminJSON}', '${hashedPassword}');`,
        );
      }

      const query2 = `DELETE FROM keys WHERE key = '${hashedKey}';`;
      await databaseSqlQuery(query2);

      return id;
    } catch (error) {
      throw new Error('asd');
    }
  },

  findAdmin: async (email: string): Promise<false | IAdmin | never> => {
    try {
      const query = `SELECT * FROM admins WHERE data ->> 'email' = '${email}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  findAdminById: async (id: string): Promise<false | IAdmin | never> => {
    try {
      const query = `SELECT * FROM admins WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);
      if (res.rowCount === 1) {
        return res.rows[0];
      }

      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateAdmin: async (
    updatedData: IAdminData,
    id: string,
  ): Promise<boolean | never> => {
    try {
      const updatedDataJson = JSON.stringify(updatedData);
      const query = `UPDATE admins SET data = '${updatedDataJson}' WHERE id = '${id}'`;
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

export default admins;
