import owners from '../../controllers/owners/controller';
import realtors from '../../controllers/realtors/controller';

const findAnyUserByEmail = async (email: string) => {
  let candidate = await owners.findOwner(email);
  if (!candidate) {
    candidate = await realtors.findRealtor(email);
  }

  return candidate;
};

const findAnyUserById = async (id: string) => {
  let candidate = await owners.findOwnerById(id);
  if (!candidate) {
    candidate = await realtors.findRealtorById(id);
  }

  return candidate;
};

export { findAnyUserByEmail, findAnyUserById };
