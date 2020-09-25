import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import realtors from './controller';
import mailer from '../../services/mail/nodemailer.service';
import owners from '../owners/controller';
import { validationRealtors } from '../../services/validation/validation';

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
      console.log('realtors router', error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default router;
