import { profileFetchingErrorHandler, usernameUpdateErrorHandler } from '../error/errorHandling.js';
import UserModel from '../models/userModel.js';

async function getTargetUserController(req, res, next) {
  console.log('getTargetUserController run');
  const targetUserId = req.userId;
  try {
    const targetUser = await UserModel.findById(targetUserId, { username: 1, email: 1, totalOrderCount: 1, totalShippingAddressCount: 1 });
    if (targetUser === null) {
      throw new Error('We can not fetch your account. Please try again later');
    } else {
      res.status(200).json(targetUser);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = profileFetchingErrorHandler();
    next(customizedErrorObject);
  }
}

//-----------------------------------------------------------------------------------------------------------

async function updateTargetUserController(req, res, next) {
  console.log('updateTargetUserController run');
  const targetUserId = req.userId;
  const requestBody = req.body;

  try {
    const newTargetUser = await UserModel.findByIdAndUpdate(
      targetUserId,
      {
        username: requestBody.newUsernameInput,
      },
      { new: true, select: 'username email shippingAddressList totalOrderCount totalShippingAddressCount', runValidators: true }
    );
    res.status(200).json(newTargetUser);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = usernameUpdateErrorHandler();
    next(customizedErrorObject);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export { getTargetUserController, updateTargetUserController };
