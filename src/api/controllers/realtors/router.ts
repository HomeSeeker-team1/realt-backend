import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import realtors from './controller';
import mailer from '../../services/nodemailer.service';
import owners from '../owners/controller';

const router = Router();

router.post(
  '/realtors',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
    check('agency', 'Выберите тип аккаунта').isBoolean(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const allErrors = errors.array();
      const {
        email,
        password,
        agency,
        passwordRepeat,
        name,
        surname,
        patronymic,
        phone,
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
      const isRealtorExist = await realtors.findRealtor(email);
      const isOwnerExist = await owners.findOwner(email);

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

      const hashedPassword = await bcrypt.hash(password, 12);

      await realtors.createCandidate({
        email,
        hashedPassword,
        agency,
        phone,
        surname,
        patronymic,
        name,
      });

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
