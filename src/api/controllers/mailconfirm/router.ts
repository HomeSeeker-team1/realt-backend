import { Router, Request, Response } from 'express';
import mailConfirm from './controller';

const router = Router();

router.get('/mailconfirm/:id', async (req: Request, res: Response) => {
  try {
    const isMatch = await mailConfirm.isExistCandidate(req.params.id);
    if (isMatch) {
      return res
        .status(201)
        .json({ message: 'Пользователь создан! => редирект на сайт' });
    }
    return res.status(404).json({ message: 'Незарегистрированные данные' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
