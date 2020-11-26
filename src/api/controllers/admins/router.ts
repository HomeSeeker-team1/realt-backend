import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'express-jwt';

import admins from './controller';

import { findAnyUserByEmail } from '../../helpers/databaseRequests/findAnyUser';

import {
  validationAdmins,
  validationUpdateAdmins,
} from '../../middlewares/validation/validation';
import JWT_CONFIG from '../../../constants/jwt/jwt';
import Admin from '../../models/Admin';

const router = Router();

router.post('/', validationAdmins, async (req: Request, res: Response) => {
  try {
    const isValidKey = await admins.isKeyOk(req);

    if (!isValidKey) {
      return res.status(400).json({
        message: 'Неправильный ключ',
      });
    }

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

    const isUserExist = await findAnyUserByEmail(email);

    if (isUserExist) {
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

    await admins.createAdmin(req.body);

    return res.status(200).json({
      message: 'Пользователь успешно зарегистрирован',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.get(
  '/',
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
      const admin = await admins.findAdminById(userId);

      if (!admin) {
        return res.status(404).json({
          message: 'Пользователь не авторизован',
        });
      }

      const adminData = new Admin(admin.data);

      return res.status(200).json(adminData);
    } catch (error) {
      return res.status(500).json('Server Error');
    }
  },
);

router.put(
  '/',
  validationUpdateAdmins,
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
      const admin = await admins.findAdminById(userId);

      if (!admin) {
        return res.status(404).json({
          message: 'Пользователь не авторизован',
        });
      }

      const updatedData = { ...admin.data, ...req.body };
      updatedData.email = admin.data.email;
      updatedData.phone = admin.data.phone;
      updatedData.active = admin.data.active;

      const databaseResponse = await admins.updateAdmin(updatedData, userId);
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
