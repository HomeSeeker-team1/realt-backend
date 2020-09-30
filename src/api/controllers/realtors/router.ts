import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'express-jwt';

import realtors from './controller';
import mailer from '../../services/mail/nodemailer.service';
import owners from '../owners/controller';
import { validationRealtors } from '../../middlewares/validation/validation';
import JWT_CONFIG from '../../../constants/jwt/jwt';
import { findAnyUserById } from '../../helpers/database-requests/findAnyUser';
import MEMBERS from '../../../constants/members/members';
import Owner from '../../models/Owner';
import Realtor from '../../models/Realtor';

const router = Router();

router.post(
  '/realtors',
  validationRealtors,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const allErrors = errors.array();
      const { email, password, passwordRepeat } = req.body;

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные при регистрации',
        });
      }

      if (passwordRepeat !== password) {
        allErrors.push({
          value: '',
          msg: 'Пароли не совпадают',
          param: 'password',
          location: 'body',
        });
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные при регистрации',
        });
      }

      const isRealtorExist = await realtors.findRealtor(email);
      const isOwnerExist = await owners.findOwner(email);

      if (isRealtorExist || isOwnerExist) {
        allErrors.push({
          value: '',
          msg: 'Пользователь с таким email уже зарегистрирован.',
          param: 'email',
          location: 'body',
        });
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные при регистрации',
        });
      }

      await realtors.createRealtor(req.body);

      mailer.sendConfirm(email);

      return res.status(200).json({
        message: 'Письмо с подтверждением регистрации отправлено на почту',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

router.get(
  '/realtors',
  jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(400).json({
          message: 'Заголовки запроса не корректны',
        });
      }
      // @ts-ignore
      const { userId } = req.user;
      const user = await findAnyUserById(userId);

      if (!user) {
        res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      const { type } = user.data;
      let userData;
      if (type === MEMBERS.OWNER) {
        userData = new Owner(user.data);
      }
      if (type === MEMBERS.REALTOR) {
        userData = new Realtor(user.data);
      }

      return res.status(200).json(userData);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server Error');
    }
  },
);

export default router;
