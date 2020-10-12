import { Router, Request, Response } from 'express';
import jwt from 'express-jwt';

import JWT_CONFIG from '../../../constants/jwt/jwt';
import MEMBERS from '../../../constants/members/members';
import flatValidator from '../../helpers/auctionValidators/flatValidator';
import flats from './controller';

const router = Router();

router.post(
  '/',
  jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Заголовки запроса не корректны',
        });
      }

      // @ts-ignore
      const { userType, userId } = req.user;

      if (userType !== MEMBERS.OWNER) {
        return res.status(400).json({
          message: 'Создавать аукционы могут только собственники',
        });
      }

      const flat = flatValidator.add(req.body);
      if (flat.error) {
        return res.status(400).json(flat);
      }

      const isFlatCreated = await flats.create(flat, userId);

      if (isFlatCreated) {
        return res.status(200).json({
          message: 'Аукцион успешно создан',
        });
      }

      return res.status(400).json({
        message: 'Что-то пошло не так',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

router.get(
  '/',
  jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Заголовки запроса не корректны',
        });
      }

      // @ts-ignore
      const { userType, userId } = req.user;

      if (userType !== MEMBERS.OWNER) {
        return res.status(400).json({
          message: 'Получать свои аукционы могут только собственники',
        });
      }

      const auctions = await flats.get(userId);
      return res.status(200).json({
        auctions,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

router.put(
  '/',
  jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Заголовки запроса не корректны',
        });
      }

      // @ts-ignore
      const { userType, userId } = req.user;
      const { auctionId } = req.body;

      if (userType !== MEMBERS.OWNER) {
        return res.status(400).json({
          message: 'Редактировать аукционы могут только собственники',
        });
      }

      const flat = flatValidator.add(req.body);
      if (flat.error) {
        return res.status(400).json(flat);
      }

      const isFlatUpdated = await flats.update(flat, userId, auctionId);

      if (isFlatUpdated) {
        return res.status(200).json({
          message: 'Аукцион успешно изменен',
        });
      }

      return res.status(400).json({
        message: 'Что-то пошло не так',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

router.delete(
  '/',
  jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: 'Заголовки запроса не корректны',
        });
      }

      // @ts-ignore
      const { userType, userId } = req.user;
      const { auctionId } = req.body;

      if (userType !== MEMBERS.OWNER) {
        return res.status(400).json({
          message: 'Удалять аукционы могут только собственники',
        });
      }

      const isAuctionDeleted = await flats.delete(userId, auctionId);
      if (isAuctionDeleted) {
        return res.status(200).json({
          message: 'Аукцион успешно удалён!',
        });
      }

      return res.status(400).json({
        message: 'Что-то пошло не так!',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  },
);

export default router;
