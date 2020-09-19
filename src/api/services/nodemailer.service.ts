import nodemailer from 'nodemailer';
import config from 'config';

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
  sendConfirm: async (email: string, candidateId: string) => {
    const domen = process.env.NODE_ENV === 'develop'
      ? config.get('mode.local.host')
      : config.get('mode.remote.host');
    const url = `${domen}/mailconfirm/${candidateId}`;
    const res = await transporter.sendMail({
      from: '"Realt 👻" <realtconfirm@gmail.com>',
      to: email,
      subject: 'Realt registration confirm ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `<b>Подтвердите регистрацию перейдя по <a href="${url}">ссылке</a></b>`, // html body
    });

    return res;
  },
};

export default mailer;
