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
    check('isAgency', 'Выберите тип аккаунта').isBoolean(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации',
        });
      }

      const { email, password, isAgency } = req.body;
      const isCandidateExist = await realtors.findCandidate(email);

      if (isCandidateExist) {
        return res.status(400).json({
          message:
            'Пользователь с таким email уже пытался зарегистрироваться. Послать письмо повторно?',
        });
      }

      const candidateId = await realtors.createCandidate({
        email,
        password,
        isAgency,
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
