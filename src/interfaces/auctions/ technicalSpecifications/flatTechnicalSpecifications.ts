const FLAT_TECHNICAL_SPEC = {
  area: 123,
  balcony: 123,
  isBalconyIncluded: true,
  rooms: 123,
  kitchenArea: 123,
  combinedBathroom: true,
  separateRooms: true,
  houseBuildYear: 123,
  houseBuildingMaterial: 'string',
  floor: 'string',
  conditionOfTheApartment: 'string',
  landscapedHouse: true,
};

type TFlatTechnicalSpecifications = typeof FLAT_TECHNICAL_SPEC;

export { FLAT_TECHNICAL_SPEC, TFlatTechnicalSpecifications };
