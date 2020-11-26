import { Router, Request, Response } from 'express';

import { check, validationResult } from 'express-validator';
import auth from './controller';
import JWT_CONFIG from '../../../constants/jwt/jwt';
import { findAnyUserByEmail } from '../../helpers/databaseRequests/findAnyUser';
import VALIDATION_TEXT from '../../../constants/validation/descriptions';
import regx from '../../../constants/validation/regExp';
import THOUSAND_MILISECONDS from '../../../constants/time/time';

const router = Router();

router.post(
  '/login',
  check('email', VALIDATION_TEXT.incorrectEmail).isEmail(),
  check('password', VALIDATION_TEXT.password).matches(regx.password(), 'g'),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const allErrors = errors.array();

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: allErrors,
          message: 'Введены некорректные данные',
        });
      }

      const user = await findAnyUserByEmail(req.body.email);
      if (user) {
        return auth.login(req, res, user);
      }
      return res.status(404).json({ message: 'Пользователь не найден' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decodedToken = await auth.decodedToken(token);
    // @ts-ignore
    const { userId, userType, exp } = decodedToken;

    const now = Date.now() / THOUSAND_MILISECONDS;

    if (exp < now) {
      return res.status(400).json({
        message: 'Токен истек, войдите заного',
      });
    }

    const newAccessToken = await auth.getToken(
      userId,
      userType,
      JWT_CONFIG.ACCESS_TOKEN_EXPIRES,
    );
    return res.status(200).json({
      access_token: `Bearer ${newAccessToken}`,
      expires_in: Date.now() + JWT_CONFIG.ACCESS_TOKEN_EXPIRES * 1000,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
