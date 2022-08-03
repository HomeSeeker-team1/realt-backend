const CONFIRM_TITLE = 'Realt registration confirm ✔';
const STANDART_TITLE = 'Realt';

const confirmLayout = (url: string) => `<b>Подтвердите регистрацию перейдя по <a target="_blank" href="${url}">ссылке</a></b>`;
const anyLayout = (text: string) => `<b>${text}</b>`;

export {
  confirmLayout, anyLayout, CONFIRM_TITLE, STANDART_TITLE,
};
