import owners from '../../controllers/owners/controller';
import realtors from '../../controllers/realtors/controller';
import admins from '../../controllers/admins/controller';

const findAnyUserByEmail = async (email: string) => {
  const candidate = (await owners.findOwner(email))
    || (await realtors.findRealtor(email))
    || (await admins.findAdmin(email));

  return candidate;
};

const findAnyUserById = async (id: string) => {
  const candidate = (await owners.findOwnerById(id))
    || (await realtors.findRealtorById(id))
    || (await admins.findAdminById(id));

  return candidate;
};

export { findAnyUserByEmail, findAnyUserById };
