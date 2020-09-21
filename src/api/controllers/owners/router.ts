import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import owners from './controller';
import realtors from '../realtors/controller';

const router = Router();

router.post(
  '/owners',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const allErrors = errors.array();
      const {
        email,
        password,
        passwordRepeat,
        name,
        surname,
        patronymic,
      } = req.body;

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

      const isCandidateExist = await realtors.findCandidate(email);
      const isOwnerExist = await owners.findOwner(email);
      const isRealtorExist = await realtors.findRealtor(email);

      if (isCandidateExist) {
        allErrors.push({
          value: '',
          msg: 'Пользователь с таким email уже пытался зарегистрироваться.',
          param: 'email',
          location: 'body',
        });
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные при регистрации',
        });
      }

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

      const hashedPassword = await bcrypt.hash(password, 12);

      await owners.createOwner({
        email,
        hashedPassword,
        surname,
        patronymic,
        name,
      });

      return res.status(200).json({
        message: 'Пользователь успешно зарегистрирован',
      });
    } catch (error) {
      console.log('realtors router', error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default router;
