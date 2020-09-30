import { check } from 'express-validator';

import VALIDATION_TEXT from '../../../constants/validation/descriptions';
import regx from '../../../constants/validation/regExp';

const validation = [
  check('email', VALIDATION_TEXT.incorrectEmail).isEmail(),
  check('password', VALIDATION_TEXT.password).isLength({
    min: 6,
  }),
  check('name', VALIDATION_TEXT.name).matches(regx.name(), 'u'),
  check('surname', VALIDATION_TEXT.surname).matches(regx.name(), 'u'),
  check('patronymic', VALIDATION_TEXT.patronymic).matches(
    regx.patronymic(),
    'u',
  ),
];

const validationRealtors = [
  ...validation,
  check('agency', 'Выберите тип аккаунта').isBoolean(),
];

export { validation, validationRealtors };
