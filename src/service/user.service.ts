import log from '../utils/logger';
import { createUser, getUser } from '../models/user.model';

export const createUserService = async (
  username: string,
  password: string,
  email: string,
  name: string,
) => {
  log.info('[createUserService]');
  const result = await createUser({
    username,
    password,
    email,
    name,
  });
  if (result) {
    console.log(result);
    return result;
  } else {
    console.log('null');
    return null;
  }
};

export const getUserService = async (username: string, password: string) => {
  log.info('[getUserService]');
  const result = await getUser({ username, password });
  console.log('[result] : ', result);
  if (result) {
    return result;
  } else {
    console.log('null');
    return null;
  }
};
