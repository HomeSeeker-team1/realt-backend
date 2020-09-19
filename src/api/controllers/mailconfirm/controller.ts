import databaseSqlQuery from '../../database-utils';

const mailConfirm = {
  isExistCandidate: async (id: string) => {
    try {
      const query = `select id from candidates WHERE id = '${id}'`;
      const res = await databaseSqlQuery(query);

      if (res.rowCount === 1) {
        return true;
      }
      throw Error;
    } catch (error) {
      throw Error;
    }
  },
};

export default mailConfirm;
