import { Router, Request, Response } from 'express';
import crawler from './controller';

const router = Router();

router.get('/crawler', async (req: Request, res: Response) => {
  try {
    const craw = await crawler.run();
    return craw;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
