import { Int, VarChar } from 'mssql';
import { sqlConnect } from '../utils/connection';

interface User {
  user_id?: number;
  username: string;
  password: string;
  email: string;
  name: string;
}

interface IUserLogin {
  username: string;
  password: string;
}

interface IUserUpdate {
  user_id: number;
  password: string;
}

export const createUser = async ({ username, password, email, name }: User) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('username', VarChar, username)
    .input('password', VarChar, password)
    .input('email', VarChar, email)
    .input('name', VarChar, name)
    .query(
      'INSERT INTO users(username,password,email,name) VALUES(@username,@password,@email,@name) ; SELECT SCOPE_IDENTITY() AS id',
    );

  if (result?.rowsAffected[0] == 1) {
    return result.recordset[0].id;
  } else {
    return null;
  }
};

export const getUser = async ({ username, password }: IUserLogin) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('username', VarChar, username)
    .query('SELECT * FROM users WHERE username=@username');

  console.log(result);

  const userpassword = result?.recordset[0].password;

  if (!password.match(userpassword)) {
    return null;
  } else {
    return result?.recordset[0];
  }
};

export const updateUser = async ({ user_id, password }: IUserUpdate) => {
  const pool = await sqlConnect();
  const result = await pool
    ?.request()
    .input('user_id', Int, user_id)
    .query('SELECT * FROM users WHERE user_id=@user_id');

  console.log(result);

  if (result?.recordset.length == 0) {
    return null;
  } else {
    const result = await pool
      ?.request()
      .input('password', VarChar, password)
      .input('user_id', Int, user_id)
      .query('UPDATE users SET password=@password WHERE user_id=@user_id');

    console.log('updated : ', result);

    if (result?.recordset.length == 0) {
      return null;
    } else {
      return result?.recordset[0].user_id;
    }
  }
};
