import createHttpError from 'http-errors';
import { Session } from '../models/session.model';
import { User } from '../models/user.model';

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    next(new createHttpError.Unauthorized('Please provide access token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    next(new createHttpError.Unauthorized('Please provide accessToken'));
  }

  const session = await Session.findOne({
    accessToken,
  });
  if (session === null) {
    next(new createHttpError.Unauthorized('Session not found'));
  }

  if (session.accessTokenValidUntill < new Date()) {
    next(new createHttpError.Unauthorized('Access token expired'));
  }

  const user = await User.findOne({ _id: session.userId });

  if (user === null) {
    next(new createHttpError.Unauthorized('User not found'));
  }
  req.user = { _id: user._id, name: user.name };
  next();
}
