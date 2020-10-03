import nodemailer from 'nodemailer';
import config from 'config';

import realtors from '../../controllers/realtors/controller';
import owners from '../../controllers/owners/controller';
import {
  confirmLayout,
  anyLayout,
  CONFIRM_TITLE,
  STANDART_TITLE,
} from '../../../constants/mail/confirmLayout';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'realtconfirm@gmail.com', // generated ethereal user
    pass: 'r7eM3qOjc0R2', // generated ethereal password
  },
});

const mailer = {
  send: async (email: string, layout: string, title: string) => {
    try {
      const res = await transporter.sendMail({
        from: '"Realt 👻" <realtconfirm@gmail.com>',
        to: email,
        subject: title, // Subject line
        text: 'Hello world?', // plain text body
        html: layout, // html body
      });

      return res;
    } catch (error) {
      throw Error;
    }
  },
  async sendConfirm(email: string) {
    try {
      const realtor = await realtors.findRealtor(email);
      const owner = await owners.findOwner(email);
      if (!realtor && !owner) {
        return false;
      }

      const domen = process.env.NODE_ENV === 'develop'
        ? config.get('mode.local.host')
        : config.get('mode.remote.host');
      const id = realtor.id || owner.id;
      const url = `${domen}/mail/mailconfirm/${id}`;
      const layout = confirmLayout(url);

      const res = await this.send(email, layout, CONFIRM_TITLE);
      return res;
    } catch (error) {
      throw Error;
    }
  },
  async sendAnyMail(
    email: string,
    text: string,
    title: string = STANDART_TITLE,
  ) {
    try {
      const layout = anyLayout(text);
      const res = await this.send(email, layout, title);
      return res;
    } catch (error) {
      throw Error;
    }
  },
};

export default mailer;
