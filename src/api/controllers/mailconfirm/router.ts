import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

import mailConfirm from './controller';
import mailer from '../../services/mail/nodemailer.service';

const router = Router();

router.get('/mailconfirm/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConfirm = await mailConfirm.confirmMember(id);

    if (isConfirm) {
      return res
        .status(201)
        .json({ message: 'Email подтвержден! => редирект на сайт' });
    }
    return res.status(404).json({ message: 'Незарегистрированные данные' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post(
  '/mailconfirm',
  [check('email', 'Некорректный email').isEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const allErrors = errors.array();
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные',
        });
      }
      const { email } = req.body;
      const isSentComplete = await mailer.sendConfirm(email);

      if (isSentComplete) {
        return res.status(200).json({
          message:
            'Письмо с подтверждением регистрации отправлено на почту повторно',
        });
      }

      return res.status(400).json({
        message: 'Письмо не отправлено, пользователь не найден',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

router.post(
  '/send',
  [
    check('email', 'Некорректный email').isEmail(),
    check('text', 'Текст отправки письма минимум 6 знаков').isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      const allErrors = errors.array();
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: allErrors,
          message: 'Некорректные данные',
        });
      }
      const { email, text, title } = req.body;

      await mailer.sendAnyMail(email, text, title);

      return res.status(200).json({ message: 'Письмо отправлено' });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default router;
