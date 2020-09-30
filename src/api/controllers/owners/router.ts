import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import owners from './controller';
import realtors from '../realtors/controller';
import { validation } from '../../middlewares/validation/validation';

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
    console.log('realtors router', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
