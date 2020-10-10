import { check } from 'express-validator';

import VALIDATION_TEXT from '../../../constants/validation/descriptions';
import regx from '../../../constants/validation/regExp';

const nameValidation = [
  check('name', VALIDATION_TEXT.name).matches(regx.name(), 'gm'),
  check('surname', VALIDATION_TEXT.surname).matches(regx.name(), 'gm'),
  check('patronymic', VALIDATION_TEXT.patronymic).matches(
    regx.patronymic(),
    'gm',
  ),
];

const validation = [
  ...nameValidation,
  check('email', VALIDATION_TEXT.incorrectEmail).isEmail(),
  check('password', VALIDATION_TEXT.password).matches(regx.password(), 'g'),
  check('phone', VALIDATION_TEXT.phone).matches(regx.phone(), ''),
];

const validationRealtors = [
  ...validation,
  check('agency', 'Выберите тип аккаунта').isBoolean(),
];

const validationUpdateRealtors = [
  ...nameValidation,
  check('agency', 'Выберите тип аккаунта').isBoolean(),
];

const validationUpdateOwners = [...nameValidation];

const validationUpdateAdmins = [...nameValidation];

const validationMailText = [
  check('email', 'Некорректный email').isEmail(),
  check('text', VALIDATION_TEXT.text).matches(regx.text(), ''),
  check('title', VALIDATION_TEXT.title).matches(regx.text(), ''),
];

export {
  validation,
  nameValidation,
  validationRealtors,
  validationUpdateRealtors,
  validationUpdateOwners,
  validationUpdateAdmins,
  validationMailText,
};
