import { v4 as uuidv4 } from 'uuid';

import { IFlat } from '../../../../interfaces/auctions/flat';
import databaseSqlQuery from '../../../databaseUtils';
import AUCTIONS_TYPES from '../../../../constants/auction/auctionTypes';
import AUCTIONS_TIMES from '../../../../constants/auction/auctionTimes';

const flatDefaultAuctionData = {
  type: AUCTIONS_TYPES.FLAT,
  isCheck: true,
  active: false,
  end: null,
};

const flatStartAuctionData = {
  type: AUCTIONS_TYPES.FLAT,
  isCheck: true,
  active: true,
  end: Date.now() + AUCTIONS_TIMES.PERIOD,
};

const flats = {
  async create(flat: IFlat, userId: string) {
    try {
      const id = uuidv4();
      const data = JSON.stringify(flat);
      const defaultAuctionData = JSON.stringify(flatDefaultAuctionData);
      const query = `INSERT INTO auctions (id, owner_id, data, auction_data)
      VALUES ('${id}', '${userId}', '${data}', '${defaultAuctionData}')`;
      const res = await databaseSqlQuery(query);
      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },

  async update(flat: IFlat, userId: string, auctionId: string) {
    const data = JSON.stringify(flat);
    const query = `UPDATE auctions SET data = '${data}'
     WHERE id = '${auctionId}' AND owner_id = '${userId}';`;
    const res = await databaseSqlQuery(query);

    return res.rowCount === 1;
  },

  async get(userId: string) {
    try {
      const query = `select * from auctions WHERE owner_id = '${userId}'`;
      const res = await databaseSqlQuery(query);

      return res.rows;
    } catch (error) {
      throw new Error(error);
    }
  },

  async delete(userId: string, auctionId: string) {
    try {
      const query = `DELETE FROM auctions WHERE id = '${auctionId}' AND owner_id = '${userId}'; `;
      const res = await databaseSqlQuery(query);

      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },

  async start(userId: string, auctionId: string) {
    try {
      const startAuctionData = JSON.stringify(flatStartAuctionData);
      const query = `UPDATE auctions SET auction_data = '${startAuctionData}'
     WHERE id = '${auctionId}' AND owner_id = '${userId}';`;
      const res = await databaseSqlQuery(query);

      return res.rowCount === 1;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default flats;
