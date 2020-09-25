import { check } from 'express-validator';

import validationText from '../../../constants/validation/descriptions';
import regx from '../../../constants/validation/regExp';

const validation = [
  check('email', validationText.incorrectEmail).isEmail(),
  check('password', validationText.password).isLength({
    min: 6,
  }),
  check('name', validationText.name).matches(regx.name(), 'u'),
  check('surname', validationText.surname).matches(regx.name(), 'u'),
  check('patronymic', validationText.patronymic).matches(
    regx.patronymic(),
    'u',
  ),
];

const validationRealtors = [
  ...validation,
  check('agency', 'Выберите тип аккаунта').isBoolean(),
];

export { validation, validationRealtors };
