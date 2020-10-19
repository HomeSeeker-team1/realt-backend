import { v4 as uuidv4 } from 'uuid';

import { IFlat } from '../../../interfaces/auctions/flat';
import databaseSqlQuery from '../../database-utils';
import AUCTIONS_TYPES from '../../../constants/auction/auctionTypes';
import AUCTIONS_TIMES from '../../../constants/auction/auctionTimes';

const flatDefaultAuctionData = {
  type: AUCTIONS_TYPES.FLAT,
  isCheck: false,
  active: false,
  end: null,
};

const flats = {
  async create(flat: IFlat, userId: string) {
    try {
      const id = uuidv4();
      const data = JSON.stringify(flat);
      const query = `INSERT INTO auctions (id, foreign_key, data, auction_data)
      VALUES ('${id}', '${userId}', '${data}', '${flatDefaultAuctionData}';`;
      const res = await databaseSqlQuery(query);

      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },

  async update(flat: IFlat, userId: string, auctionId: string) {
    const data = JSON.stringify(flat);
    const query = `UPDATE auctions SET data = '${data}' AND auction_data = '${flatDefaultAuctionData}'
     WHERE id = '${auctionId}' AND foreign_key = '${userId}';`;
    const res = await databaseSqlQuery(query);

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

  async start(userId: string, auctionId: string) {
    try {
      const flatAuctionData = {
        type: AUCTIONS_TYPES.FLAT,
        isCheck: true,
        active: true,
        end: Date.now() + AUCTIONS_TIMES.PERIOD,
      };
      const query = `UPDATE auctions SET auction_data = '${flatAuctionData}'
     WHERE id = '${auctionId}' AND foreign_key = '${userId}';`;
      const res = await databaseSqlQuery(query);

      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default flats;
