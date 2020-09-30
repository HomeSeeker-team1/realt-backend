import { Router, Request, Response } from 'express';

import auth from './controller';
import JWT_CONFIG from '../../../constants/jwt/jwt';
import { findAnyUserByEmail } from '../../helpers/database-requests/findAnyUser';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const candidate = await findAnyUserByEmail(req.body.email);
    if (candidate) {
      return auth.login(req, res, candidate);
    }
    return res.status(404).json({ message: 'Пользователь не найден' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decodedToken = await auth.decodedToken(token);
    // @ts-ignore
    const { id, userId } = decodedToken;

    const isTokenFinded = await auth.findToken(id);
    if (isTokenFinded) {
      const newAccessToken = await auth.getAccessToken(id);
      return res.status(200).json({
        access_token: newAccessToken,
        expires_in: Date.now() + JWT_CONFIG.ACCESS_TOKEN_EXPIRES * 1000,
        userId,
      });
    }

    return res.status(404).json({
      message: 'Токен не найден',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
