import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { createJwtTokenHandler } from '../utils/utils.js';
import { userSignInErrorHandler, userRegisterErrorHandler } from '../error/errorHandling.js';

async function userRegisterController(req, res, next) {
  console.log('userRegisterController run');
  const userRegisterObjectInput = req.body;
  try {
    const newUser = await UserModel.create(userRegisterObjectInput);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();
    const responseObject = { token: createJwtTokenHandler({ userId: newUser._id, isVendor: newUser.isVendor }, 3) };
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = userRegisterErrorHandler(error);
    next(customizedErrorObject);
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

async function userSiginController(req, res, next) {
  console.log('userSiginController run');
  const emailInput = req.body.email.toLowerCase();
  const passwordInput = req.body.password;
  try {
    const targetUser = await UserModel.findOne({ email: emailInput });
    if (targetUser) {
      const passwordcomparisonResult = await bcrypt.compare(passwordInput, targetUser.password);
      if (passwordcomparisonResult) {
        const responseObject = { token: createJwtTokenHandler({ userId: targetUser._id, isVendor: targetUser.isVendor }, 3) };
        console.log('user signin success');
        res.status(200).json(responseObject);
      } else {
        throw new Error('Your password is incorrect, please try again');
      }
    } else {
      throw new Error('We could not find your email, please try another one');
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = userSignInErrorHandler(error);
    next(customizedErrorObject);
  }
}

export { userRegisterController, userSiginController };
