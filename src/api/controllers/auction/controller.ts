import { v4 as uuidv4 } from 'uuid';

import { IFlat } from '../../../interfaces/auctions/flat';
import databaseSqlQuery from '../../database-utils';

const flats = {
  async create(flat: IFlat, userId: string) {
    try {
      const id = uuidv4();
      const data = JSON.stringify(flat);
      const query = `INSERT INTO auctions (id, foreign_key, data) VALUES ('${id}', '${userId}', '${data}');`;
      const res = await databaseSqlQuery(query);

      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },

  async update(flat: IFlat, userId: string, flatId: string) {
    const data = JSON.stringify(flat);
    const query = `UPDATE auctions SET data = '${data}' WHERE id = '${flatId}' AND foreign_key = '${userId}';`;
    const res = await databaseSqlQuery(query);
    console.log(res);
    return res.rowCount === 1;
  },

  async get(userId: string) {
    try {
      const query = `select * from auctions WHERE foreign_key = '${userId}'`;
      const res = await databaseSqlQuery(query);
      return res.rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  async delete(userId: string, auctionId: string) {
    try {
      const query = `DELETE FROM auctions WHERE id = '${auctionId}' AND foreign_key = '${userId}'; `;
      const res = await databaseSqlQuery(query);
      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default flats;
