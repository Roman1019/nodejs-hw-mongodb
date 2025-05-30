import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}
