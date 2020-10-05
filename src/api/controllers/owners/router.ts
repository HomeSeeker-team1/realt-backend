import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'express-jwt';

import owners from './controller';
import realtors from '../realtors/controller';
import {
  validation,
  validationUpdateOwners,
} from '../../middlewares/validation/validation';
import JWT_CONFIG from '../../../constants/jwt/jwt';
import Owner from '../../models/Owner';

const router = Router();

router.post('/owners', validation, async (req: Request, res: Response) => {
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

    const isOwnerExist = await owners.findOwner(email);
    const isRealtorExist = await realtors.findRealtor(email);

    if (isOwnerExist || isRealtorExist) {
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

    await owners.createOwner(req.body);

    return res.status(200).json({
      message: 'Пользователь успешно зарегистрирован',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.get(
  '/owners',
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
      const owner = await owners.findOwnerById(userId);

      if (!owner) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      const ownerData = new Owner(owner.data);

      return res.status(200).json(ownerData);
    } catch (error) {
      return res.status(500).json('Server Error');
    }
  },
);

router.put(
  '/owners',
  validationUpdateOwners,
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
      const owner = await owners.findOwnerById(userId);

      if (!owner) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }

      const updatedData = { ...owner.data, ...req.body };
      updatedData.email = owner.data.email;
      updatedData.phone = owner.data.phone;
      updatedData.active = owner.data.active;

      const databaseResponse = await owners.updateOwner(updatedData, userId);
      if (databaseResponse) {
        return res.status(200).json({
          message: 'Данные успешно изменены',
        });
      }

      return res.status(404).json({
        message: 'Данные не найдены',
      });
    } catch (error) {
      throw Error;
    }
  },
);

export default router;
