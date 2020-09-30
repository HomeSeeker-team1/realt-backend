import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import JWT_CONFIG from '../../../constants/jwt/jwt';
import { IOwner } from '../../../interfaces/owner';
import databaseSqlQuery from '../../database-utils';

interface ICandidate {
  id: string;
  data: IOwner;
}

const auth = {
  async login(req: Request, res: Response, candidate: ICandidate) {
    try {
      if (candidate) {
        const { password } = req.body;
        const passwordResult = bcrypt.compareSync(
          password,
          candidate.data.password,
        );

        if (passwordResult) {
          const id = uuidv4();
          const refreshToken = jwt.sign(
            {
              userId: candidate.id,
              id,
            },
            JWT_CONFIG.KEY,
            { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES },
          );
          const accessToken = await this.getAccessToken(candidate.id);
          const saveRefreshToken = `INSERT INTO tokens (id, token) VALUES ('${id}', '${refreshToken}');`;
          await databaseSqlQuery(saveRefreshToken);
          return res.status(200).json({
            access_token: `Bearer ${accessToken}`,
            refresh_token: refreshToken,
            expires_in: Date.now() + JWT_CONFIG.ACCESS_TOKEN_EXPIRES * 1000,
            userId: candidate.id,
          });
        }
      }
      return res.status(401).json({ message: 'Введены неверные данные' });
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async decodedToken(token: string) {
    const decoded = await jwt.verify(token, JWT_CONFIG.KEY);
    return decoded;
  },

  async findToken(id: string) {
    try {
      const findTokenQuery = `SELECT id FROM tokens WHERE id = '${id}'`;
      const res = await databaseSqlQuery(findTokenQuery);
      if (res.rowCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  },

  async getAccessToken(userId: string) {
    const token = await jwt.sign(
      {
        userId,
      },
      JWT_CONFIG.KEY,
      { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES },
    );

    return token;
  },
};

export default auth;
