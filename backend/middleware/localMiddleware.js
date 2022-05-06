import jwt from 'jsonwebtoken';
import { jwtVerificationErrorHandler, vendorAuthorizationErrorHandler } from '../error/errorHandling.js';

function jwtVerificationHandler(req, res, next) {
  console.log('jwtVerificationHandler run');
  try {
    if (req.headers.token.startsWith('Bearer')) {
      const receivedToken = req.headers.token.split(' ')[1];
      jwt.verify(receivedToken, process.env.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
          console.log('Your authentication is not valid, please sign in again');
          throw new Error('Your authentication is not valid, please sign in again');
        } else {
          req.userId = decoded.userId;
          req.isVendor = decoded.isVendor;
          console.log('jwt auth success');
          next();
        }
      });
    } else {
      console.log('You are not authenticated yet, please sign in first');
      throw new Error('You are not authenticated yet, please sign in first');
    }
  } catch (error) {
    console.log('jwt auth failed');
    const customizedErrorObject = jwtVerificationErrorHandler();
    next(customizedErrorObject);
  }
}

//-----------------------------------------------------------------------------------------------

function vendorAuthorizationHandler(req, res, next) {
  console.log('vendorAuthorizationHandler run');

  try {
    if (req.isVendor) {
      next();
    } else {
      throw new Error('You are not authorized to view or perform actions');
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = vendorAuthorizationErrorHandler();
    next(customizedErrorObject);
  }
}

export { jwtVerificationHandler, vendorAuthorizationHandler };
