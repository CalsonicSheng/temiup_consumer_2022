import { addressFetchingErrorHandler, createOrUpdateAddressErrorHandler, deleteAddressErrorHandler } from '../error/errorHandling.js';
import AddressModel from '../models/addressModel.js';
import UserModel from '../models/userModel.js';

async function getTargetUserAddressesController(req, res, next) {
  console.log('getTargetUserAddressesController run');
  const targetUserId = req.userId;

  try {
    const targetUserAddressCount = await AddressModel.countDocuments({ userId: targetUserId });
    const targetUserAddressList = await AddressModel.find({ userId: targetUserId }).sort({ isDefault: -1, createdAt: -1 });
    const responseObject = { targetUserAddressList, targetUserAddressCount };
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = addressFetchingErrorHandler();
    next(customizedErrorObject);
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------

async function createTargetUserNewAddressController(req, res, next) {
  console.log('createNewUserAddressController run');
  const targetUserId = req.userId;
  const requestBody = req.body;

  try {
    if (requestBody.isDefault) {
      await AddressModel.updateMany({ userId: targetUserId }, { isDefault: false });
      await AddressModel.create({
        userId: targetUserId,
        firstName: requestBody.fNameInput,
        lastName: requestBody.lNameInput,
        address: requestBody.addressInput,
        additionalAddress: requestBody.additionalAddressInput,
        city: requestBody.cityInput,
        country: requestBody.selectedCountryInput,
        provinceOrState: requestBody.selectedProvinceOrStateInput,
        zipCode: requestBody.zipCodeInput,
        phone: requestBody.phoneInput,
        isDefault: requestBody.saveAsDefaultInput,
        addressSummary: `${requestBody.addressInput},${requestBody.additionalAddressInput === '' ? '' : ' ' + requestBody.additionalAddressInput + ','} ${requestBody.cityInput} ${
          requestBody.selectedProvinceOrStateInput
        } ${requestBody.selectedCountryInput}, ${requestBody.zipCodeInput} (${requestBody.fNameInput} ${requestBody.lNameInput})`,
      });

      await UserModel.findByIdAndUpdate(targetUserId, {
        $inc: {
          totalShippingAddressCount: 1,
        },
      });

      const targetUserAddressCount = await AddressModel.countDocuments({ userId: targetUserId });
      const targetUserAddressList = await AddressModel.find({ userId: targetUserId }).sort({ isDefault: -1, createdAt: -1 });
      const responseObject = { targetUserAddressList, targetUserAddressCount };
      res.status(200).json(responseObject);
    } else {
      await AddressModel.create({
        userId: targetUserId,
        firstName: requestBody.fNameInput,
        lastName: requestBody.lNameInput,
        address: requestBody.addressInput,
        additionalAddress: requestBody.additionalAddressInput,
        city: requestBody.cityInput,
        country: requestBody.selectedCountryInput,
        provinceOrState: requestBody.selectedProvinceOrStateInput,
        zipCode: requestBody.zipCodeInput,
        phone: requestBody.phoneInput,
        isDefault: requestBody.saveAsDefaultInput,
        addressSummary: `${requestBody.addressInput},${requestBody.additionalAddressInput === '' ? '' : ' ' + requestBody.additionalAddressInput + ','} ${requestBody.cityInput} ${
          requestBody.selectedProvinceOrStateInput
        } ${requestBody.selectedCountryInput}, ${requestBody.zipCodeInput} (${requestBody.fNameInput} ${requestBody.lNameInput})`,
      });

      await UserModel.findByIdAndUpdate(targetUserId, {
        $inc: {
          totalShippingAddressCount: 1,
        },
      });

      const targetUserAddressCount = await AddressModel.countDocuments({ userId: targetUserId });
      const targetUserAddressList = await AddressModel.find({ userId: targetUserId }).sort({ isDefault: -1, createdAt: -1 });
      const responseObject = { targetUserAddressList, targetUserAddressCount };
      res.status(200).json(responseObject);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = createOrUpdateAddressErrorHandler();
    next(customizedErrorObject);
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------

async function updateTargetUserSelectedAddressController(req, res, next) {
  console.log('updateTargetUserAddressController run');
  const targetUserId = req.userId;
  const { selectedAddressId } = req.params;
  const requestBody = req.body;

  try {
    if (requestBody.isDefault) {
      await AddressModel.updateMany({ userId: targetUserId }, { isDefault: false });
      await AddressModel.updateOne(
        { _id: selectedAddressId },
        {
          firstName: requestBody.fNameInput,
          lastName: requestBody.lNameInput,
          address: requestBody.addressInput,
          additionalAddress: requestBody.additionalAddressInput,
          city: requestBody.cityInput,
          country: requestBody.selectedCountryInput,
          provinceOrState: requestBody.selectedProvinceOrStateInput,
          zipCode: requestBody.zipCodeInput,
          phone: requestBody.phoneInput,
          isDefault: requestBody.saveAsDefaultInput,
          addressSummary: `${requestBody.addressInput},${requestBody.additionalAddressInput === '' ? '' : ' ' + requestBody.additionalAddressInput + ','} ${requestBody.cityInput} ${
            requestBody.selectedProvinceOrStateInput
          } ${requestBody.selectedCountryInput}, ${requestBody.zipCodeInput} (${requestBody.fNameInput} ${requestBody.lNameInput})`,
        },
        { runValidators: true }
      );
      const targetUserAddressCount = await AddressModel.countDocuments({ userId: targetUserId });
      const targetUserAddressList = await AddressModel.find({ userId: targetUserId }).sort({ isDefault: -1, createdAt: -1 });
      const responseObject = { targetUserAddressList, targetUserAddressCount };
      res.status(200).json(responseObject);
    } else {
      await AddressModel.updateOne(
        { _id: selectedAddressId },
        {
          firstName: requestBody.fNameInput,
          lastName: requestBody.lNameInput,
          address: requestBody.addressInput,
          additionalAddress: requestBody.additionalAddressInput,
          city: requestBody.cityInput,
          country: requestBody.selectedCountryInput,
          provinceOrState: requestBody.selectedProvinceOrStateInput,
          zipCode: requestBody.zipCodeInput,
          phone: requestBody.phoneInput,
          isDefault: requestBody.saveAsDefaultInput,
          addressSummary: `${requestBody.addressInput},${requestBody.additionalAddressInput === '' ? '' : ' ' + requestBody.additionalAddressInput + ','} ${requestBody.cityInput} ${
            requestBody.selectedProvinceOrStateInput
          } ${requestBody.selectedCountryInput}, ${requestBody.zipCodeInput} (${requestBody.fNameInput} ${requestBody.lNameInput})`,
        },
        { runValidators: true }
      );
      const targetUserAddressCount = await AddressModel.countDocuments({ userId: targetUserId });
      const targetUserAddressList = await AddressModel.find({ userId: targetUserId }).sort({ isDefault: -1, createdAt: -1 });
      const responseObject = { targetUserAddressList, targetUserAddressCount };
      res.status(200).json(responseObject);
    }
  } catch (error) {
    console.log(error);
    const customizedErrorObject = createOrUpdateAddressErrorHandler();
    next(customizedErrorObject);
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------

async function deleteTargetUserSelectedAddressController(req, res, next) {
  console.log('deleteTargetUserSelectedAddressController run');
  const targetUserId = req.userId;
  const { selectedAddressId } = req.params;

  try {
    await AddressModel.deleteOne({ _id: selectedAddressId });

    await UserModel.findByIdAndUpdate(targetUserId, {
      $inc: {
        totalShippingAddressCount: -1,
      },
    });

    const targetUserAddressCount = await AddressModel.countDocuments({ userId: targetUserId });
    const targetUserAddressList = await AddressModel.find({ userId: targetUserId }).sort({ isDefault: -1, createdAt: -1 });
    const responseObject = { targetUserAddressList, targetUserAddressCount };
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = deleteAddressErrorHandler();
    next(customizedErrorObject);
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------

async function getTargetUserNewestAddressController(req, res, next) {
  console.log('getTargetUserNewestAddressController run');

  const targetUserId = req.userId;

  try {
    const targetUserNewestAddress = await AddressModel.findOne({ userId: targetUserId }).sort({ createdAt: -1 });
    res.status(200).json(targetUserNewestAddress);
  } catch (error) {
    console.log(error);
    const customizedErrorObject = addressFetchingErrorHandler();
    next(customizedErrorObject);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  getTargetUserAddressesController,
  createTargetUserNewAddressController,
  updateTargetUserSelectedAddressController,
  deleteTargetUserSelectedAddressController,
  getTargetUserNewestAddressController,
};
