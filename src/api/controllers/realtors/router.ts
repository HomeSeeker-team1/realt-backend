import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import realtors from './controller';
import mailer from '../../services/nodemailer.service';

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
      console.log(req.body);

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

      const candidateId = await realtors.createCandidate({
        email,
        password,
        passwordRepeat,
        agency,
        phone,
        surname,
        patronymic,
        name,
      });

      mailer.sendConfirm(email, candidateId);

      return res.status(200).json({
        message: 'Письмо с подтверждением регистрации отправлено на почту',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default router;
