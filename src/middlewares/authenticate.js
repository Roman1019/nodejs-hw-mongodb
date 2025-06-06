import createHttpError from 'http-errors';
import { Session } from '../models/session.model.js';
import { User } from '../models/user.model.js';

export async function authenticate(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (typeof authorization !== 'string') {
      return next(
        new createHttpError.Unauthorized('Please provide access token'),
      );
    }

    const [bearer, accessToken] = authorization.split(' ', 2);
    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
      return next(
        new createHttpError.Unauthorized('Please provide accessToken'),
      );
    }

    const session = await Session.findOne({
      accessToken,
    });
    if (session === null) {
      return next(new createHttpError.Unauthorized('Session not found'));
    }

    if (session.accessTokenValidUntill < new Date()) {
      return next(new createHttpError.Unauthorized('Access token expired'));
    }

    const user = await User.findOne({ _id: session.userId });

    if (user === null) {
      return next(new createHttpError.Unauthorized('User not found'));
    }
    req.user = { _id: user._id, name: user.name };
    next();
  } catch (err) {
    console.error('AUTH ERROR:', err);
    next(createHttpError.InternalServerError(err.message));
  }
}
