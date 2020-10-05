// import { Router, Request, Response } from 'express';
// import jwt from 'express-jwt';
//
// import JWT_CONFIG from '../../../constants/jwt/jwt';
// import MEMBERS from '../../../constants/members/members';
//
// const router = Router();
//
// router.post(
//   '/',
//   jwt({ secret: JWT_CONFIG.KEY, algorithms: ['HS256'] }),
//   async (req: Request, res: Response) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           message: 'Заголовки запроса не корректны',
//         });
//       }
//
//       // @ts-ignore
//       const { userType } = req.user;
//
//       if (userType !== MEMBERS.OWNER) {
//         return res.status(400).json({
//           message: 'Создавать аукционы могут только собственники',
//         });
//       }
//
//
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: 'Server Error' });
//     }
//   },
// );
//
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     console.log(req.body);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Server Error' });
//   }
// });
//
// router.put('/', async (req: Request, res: Response) => {
//   try {
//     console.log(req.body);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Server Error' });
//   }
// });
//
// router.delete('/', async (req: Request, res: Response) => {
//   try {
//     console.log(req.body);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Server Error' });
//   }
// });
//
// export default router;
