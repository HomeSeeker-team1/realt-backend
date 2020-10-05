import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'express-jwt';

import realtors from './controller';
import mailer from '../../services/mail/nodemailer.service';
import owners from '../owners/controller';
import {
  validationRealtors,
  validationUpdateRealtors,
} from '../../middlewares/validation/validation';
import JWT_CONFIG from '../../../constants/jwt/jwt';
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
      console.log(error);
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
      const realtor = await realtors.findRealtorById(userId);

      if (!realtor) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      const realtorData = new Realtor(realtor.data);

      return res.status(200).json(realtorData);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server Error');
    }
  },
);

router.put(
  '/realtors',
  validationUpdateRealtors,
  jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Заголовки запроса не корректны',
        });
      }

      const errors = validationResult(req);
      const allErrors = errors.array();

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные при изменении',
        });
      }

      // @ts-ignore
      const { userId } = req.user;
      const realtor = await realtors.findRealtorById(userId);

      if (!realtor) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
      const updatedData = { ...realtor.data, ...req.body };
      updatedData.email = realtor.data.email;
      updatedData.phone = realtor.data.phone;
      updatedData.active = realtor.data.active;

      const databaseResponse = await realtors.updateRealtor(
        updatedData,
        userId,
      );
      if (databaseResponse) {
        return res.status(200).json({
          message: 'Данные успешно изменены',
        });
      }

      return res.status(404).json({
        message: 'Данные не найдены',
      });
    } catch (error) {
      console.log(error);
      throw Error;
    }
  },
);

export default router;
