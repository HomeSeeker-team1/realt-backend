import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import JWT_CONFIG from '../../../constants/jwt/jwt';
import { IOwner } from '../../../interfaces/owner';
import { IRealtor } from '../../../interfaces/realtor';
import THOUSAND_MILISECONDS from '../../../constants/time/time';

const auth = {
  async login(req: Request, res: Response, candidate: IRealtor | IOwner) {
    try {
      if (candidate) {
        const { password } = req.body;
        const passwordResult = await bcrypt.compare(
          password,
          candidate.password,
        );

        const userId = candidate.id;
        const userType = candidate.data.type;

        if (passwordResult) {
          const refreshToken = await this.getToken(
            userId,
            userType,
            JWT_CONFIG.REFRESH_TOKEN_EXPIRES,
          );
          const accessToken = await this.getToken(
            userId,
            userType,
            JWT_CONFIG.ACCESS_TOKEN_EXPIRES,
          );

          return res.status(200).json({
            access_token: `Bearer ${accessToken}`,
            refresh_token: refreshToken,
            expires_in:
              Date.now()
              + JWT_CONFIG.ACCESS_TOKEN_EXPIRES * THOUSAND_MILISECONDS,
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

  async getToken(userId: string, userType: string, expirationTime: number) {
    const token = await jwt.sign(
      {
        userId,
        userType,
      },
      JWT_CONFIG.KEY,
      { expiresIn: expirationTime },
    );

    return token;
  },
};

export default auth;
