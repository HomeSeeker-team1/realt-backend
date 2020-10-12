const FLAT_LEGAL_ISSUES = {
  yearsOfOwnership: 123,
  owners: 123,
  minorOwner: true,
  basisOfOwnership: 'string',
  encumbrances: 'string',
  debts: 'string',
  homePurpose: 'string',
};

type TFlatLegalIssues = typeof FLAT_LEGAL_ISSUES;

export { FLAT_LEGAL_ISSUES, TFlatLegalIssues };
