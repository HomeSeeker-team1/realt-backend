// import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

import databaseSqlQuery from '../../database-utils';

const isKeyOk = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { key } = req.body;
    // uncomment 1 & 13,  delete 14
    // const hashedKey = await bcrypt.hash(key, 12);
    const hashedKey = key;

    const dbQuery1 = `SELECT * FROM keys WHERE key = '${hashedKey}'`;
    const dbRes = await databaseSqlQuery(dbQuery1);

    const isKeyExist = dbRes.rowCount !== 0;
    if (!isKeyExist) {
      res.status(400).json({ error: 'key required', message: 'неверный ключ' });
      throw Error('неверный ключ');
    }

    const isValueOne = dbRes.rowCount === 1;
    if (!isValueOne) {
      throw Error(`multiple keys ${hashedKey} in db`);
    }
    const dbQuery2 = `SELECT expires_in From keys WHERE key = '${hashedKey}'`;
    const dbRes2 = await databaseSqlQuery(dbQuery2);
    const expiresIn = Number(dbRes2.rows[0].expires_in);
    const isKeyNotExpired = Date.now() < expiresIn;

    if (!isKeyNotExpired) {
      res
        .status(400)
        .json({
          error: 'key required',
          message: 'время действия ключа истекло',
        });
    }
  } catch (error) {
    res.status(500).json({ error: 'server Error' });
  }
  next();
};

export default isKeyOk;
