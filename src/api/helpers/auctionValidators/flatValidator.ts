import validationError from './validationError';
import { IFlat } from '../../../interfaces/auctions/flat';
import { ADDRESS } from '../../../interfaces/auctions/address';
import { FLAT_TECHNICAL_SPEC } from '../../../interfaces/auctions/ technicalSpecifications/flatTechnicalSpecifications';
import { FLAT_LEGAL_ISSUES } from '../../../interfaces/auctions/legalIssues/flatLegalIssues';

const _ = require('lodash');

const flatFields = ['address', 'technicalSpec', 'legalIssues'];
const addressFields = Object.keys(ADDRESS);
const technicalSpecFields = Object.keys(FLAT_TECHNICAL_SPEC);
const legalIssuesFields = Object.keys(FLAT_LEGAL_ISSUES);

const flatValidator = {
  add(payload: IFlat) {
    if (!payload) {
      throw new Error();
    }

    if (!payload.address) {
      return validationError('address', 'address is required!');
    }
    if (!payload.technicalSpec) {
      return validationError('technicalSpec', 'technicalSpec is required!');
    }
    if (!payload.legalIssues) {
      return validationError('legalIssues', 'legalIssues is required');
    }

    const { address, technicalSpec, legalIssues } = payload;
    let isCorrectAddress = true;

    if (Object.keys(address).length === 0) {
      isCorrectAddress = false;
    } else {
      Object.values(address).forEach((field: string) => {
        if (!_.isString(field)) {
          isCorrectAddress = false;
        }
      });
    }

    if (!isCorrectAddress) {
      return validationError('address', 'Address lines must be strings');
    }

    switch (false) {
      case _.isInteger(technicalSpec.area):
        return validationError('area', 'Field "area" must be integer');
      case _.isInteger(technicalSpec.balcony):
        return validationError('balcony', 'Field "balcony" must be integer');
      case _.isBoolean(technicalSpec.isBalconyIncluded):
        return validationError(
          'isBalconyIncluded',
          'Field "isBalconyIncluded" must be boolean',
        );
      case _.isInteger(technicalSpec.rooms):
        return validationError('rooms', 'Field "rooms" must be integer');
      case _.isInteger(technicalSpec.kitchenArea):
        return validationError(
          'kitchenArea',
          'Field "kitchenArea" must be integer',
        );
      case _.isBoolean(technicalSpec.combinedBathroom):
        return validationError(
          'combinedBathroom',
          'Field "combinedBathroom" must be boolean',
        );
      case _.isBoolean(technicalSpec.separateRooms):
        return validationError(
          'separateRooms',
          'Field "separateRooms" must be boolean',
        );
      case _.isInteger(technicalSpec.houseBuildYear):
        return validationError(
          'houseBuildYear',
          'Field "houseBuildYear" must be integer',
        );
      case _.isString(technicalSpec.houseBuildingMaterial):
        return validationError(
          'houseBuildingMaterial',
          'Field "houseBuildingMaterial" must be string',
        );
      case _.isString(technicalSpec.floor):
        return validationError('floor', 'Field "floor" must be string');
      case _.isString(technicalSpec.conditionOfTheApartment):
        return validationError(
          'conditionOfTheApartment',
          'Field "conditionOfTheApartment" must be string',
        );
      case _.isBoolean(technicalSpec.landscapedHouse):
        return validationError(
          'landscapedHouse',
          'Field "landscapedHouse" must be boolean',
        );
      default:
    }

    switch (false) {
      case _.isInteger(legalIssues.yearsOfOwnership):
        return validationError(
          'yearsOfOwnership',
          'Field "yearsOfOwnership" must be integer',
        );
      case _.isInteger(legalIssues.owners):
        return validationError('owners', 'Field "owners" must be integer');
      case _.isBoolean(legalIssues.minorOwner):
        return validationError(
          'minorOwner',
          'Field "minorOwner" must be boolean',
        );
      case _.isString(legalIssues.basisOfOwnership):
        return validationError(
          'basisOfOwnership',
          'Field "basisOfOwnership" must be string',
        );
      case _.isString(legalIssues.encumbrances):
        return validationError(
          'encumbrances',
          'Field "encumbrances" must be string',
        );
      case _.isString(legalIssues.debts):
        return validationError('debts', 'Field "debts" must be string');
      case _.isString(legalIssues.homePurpose):
        return validationError(
          'homePurpose',
          'Field "homePurpose" must be string',
        );
      default:
    }

    const filteredFlat = _.pick(payload, flatFields);
    filteredFlat.address = _.pick(payload.address, addressFields);
    filteredFlat.technicalSpec = _.pick(
      payload.technicalSpec,
      technicalSpecFields,
    );
    filteredFlat.legalIssues = _.pick(payload.legalIssues, legalIssuesFields);

    return filteredFlat;
  },
};

export default flatValidator;
