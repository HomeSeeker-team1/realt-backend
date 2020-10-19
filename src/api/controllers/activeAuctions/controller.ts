import databaseSqlQuery from '../../database-utils';

const activeAuctions = {
  async get() {
    try {
      const query = 'SELECT * FROM auctions WHERE auction_data ->> \'active\' = \'true\'';
      const res = await databaseSqlQuery(query);

      return res.rows;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default activeAuctions;
