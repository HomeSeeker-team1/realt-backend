import { Router, Request, Response } from 'express';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/realtor/bet', async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
