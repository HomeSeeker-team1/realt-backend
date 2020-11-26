import { Router, Request, Response } from 'express';

import activeAuctions from './controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const auctions = await activeAuctions.get();
    return res.status(200).json({
      auctions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
