import { Router } from 'express';

const router = Router();

router.post('users', async (req, res) => {
  try {
    console.log('создание временного юзера, после подтверждения регистрации он становится активным');
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
