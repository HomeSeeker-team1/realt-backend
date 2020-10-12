import databaseSqlQuery from '../../database-utils';

const mailConfirm = {
  async confirmMember(id: string) {
    try {
      const selectRealtor = `select * from realtors WHERE id = '${id}'`;
      const realtorExistResponse = await databaseSqlQuery(selectRealtor);
      if (realtorExistResponse.rowCount === 1) {
        const activatedRealtor = realtorExistResponse.rows[0].data;
        activatedRealtor.active = true;
        const realtorJSON = JSON.stringify(activatedRealtor);
        const activeRealtorQuery = `UPDATE realtors SET data = '${realtorJSON}' WHERE id = '${id}'`;
        await databaseSqlQuery(activeRealtorQuery);
        return true;
      }

      const selectOwner = `select * from owners WHERE id = '${id}'`;
      const ownerExistResponse = await databaseSqlQuery(selectOwner);

      if (ownerExistResponse.rowCount === 1) {
        const activatedOwner = ownerExistResponse.rows[0].data;
        activatedOwner.active = true;
        const ownerJSON = JSON.stringify(activatedOwner);
        const activeOwnerQuery = `UPDATE owners SET data = '${ownerJSON}' WHERE id = '${id}'`;
        await databaseSqlQuery(activeOwnerQuery);
        return true;
      }

      return false;
    } catch (error) {
      throw Error;
    }
  },
};

export default mailConfirm;
