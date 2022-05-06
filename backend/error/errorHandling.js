// local middleware controller error handler

function jwtVerificationErrorHandler() {
  const customizedErrorObject = {
    notAuthenticated: true, // redirect back to auth (signin) page
    responseStatus: 401,
  };
  return customizedErrorObject;
}

function vendorAuthorizationErrorHandler() {
  const customizedErrorObject = {
    notAuthorized: true, // will show a page to inform user that you are not authorized for vendor-only contents
    responseStatus: 403,
  };
  return customizedErrorObject;
}

//----------------------------------------------------------------------------------

// auth controller error handler

function userRegisterErrorHandler(error) {
  if (error.message.includes('validation failed')) {
    const rawErrors = error.errors;
    const fieldNames = Object.keys(rawErrors);
    const errorMessages = Object.values(rawErrors).map((e) => {
      return e.message;
    });
    const customizedErrorObject = { responseStatus: 400 };
    for (const i in fieldNames) {
      customizedErrorObject[fieldNames[i]] = errorMessages[i];
    }
    return customizedErrorObject;
  } else if (error.code) {
    const customizedErrorObject = {
      customizedMessage: 'Email already exist. Please enter a different one',
      responseStatus: 400,
    };
    return customizedErrorObject;
  } else {
    const customizedErrorObject = {
      customizedMessage: 'Something went wrong at our end. Please try again later',
      responseStatus: 500,
    };
    return customizedErrorObject;
  }
}

function userSignInErrorHandler(error) {
  const customizedErrorObject = {
    customizedMessage: error.message,
    responseStatus: 400,
  };
  return customizedErrorObject;
}

//----------------------------------------------------------------------------------

// home team / select team controller error handler

function teamFetchErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Can not fetch team resources or may not be available at this time. Please try again later',
    responseStatus: 404,
  };
  return customizedErrorObject;
}

function selectedTeamFetchErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'The team resource you request may not exist. Please try to explore some other team',
    responseStatus: 404,
  };
  return customizedErrorObject;
}

//----------------------------------------------------------------------------------

// saved team controller error handler

function savedTeamsFetchErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Can not fetch your saved team at this time. Please try again later',
    responseStatus: 404,
  };
  return customizedErrorObject;
}

function saveNewTeamErrorHandler() {
  // this error must be coming from server internally or overall code bug, as in the frontend there is nothing required for user to provide
  const customizedErrorObject = {
    customizedMessage: 'Team can not be saved. Please try again',
    responseStatus: 500,
  };
  return customizedErrorObject;
}

function deleteSavedTeamErrorHandler() {
  // this error must be coming from server internally or overall code bug, as in the frontend there is nothing required for user to provide
  const customizedErrorObject = {
    customizedMessage: 'Something went wrong. Please try again',
    responseStatus: 500,
  };
  return customizedErrorObject;
}

//----------------------------------------------------------------------------------

// user profile controller error handler

function createOrUpdateAddressErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Some field(s) are empty. Please fill all fields',
    responseStatus: 400,
  };
  return customizedErrorObject;
}

function deleteAddressErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Deletion can not be completed. Please try again later',
    responseStatus: 500,
  };
  return customizedErrorObject;
}

function usernameUpdateErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Please provide a username',
    responseStatus: 400,
  };
  return customizedErrorObject;
}

function profileFetchingErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'We can not fetch your account. Please try again later',
    responseStatus: 500,
  };
  return customizedErrorObject;
}

function addressFetchingErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'We can not fetch your address. Please try again later',
    responseStatus: 500,
  };
  return customizedErrorObject;
}

//----------------------------------------------------------------------------------

// order controller error handler

function joinTeamAndCreateNewOrderErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Something went wrong or team has just become unavailable. Please try again later',
    responseStatus: 500,
  };
  return customizedErrorObject;
}

function orderFetchErrorHandler() {
  const customizedErrorObject = {
    customizedMessage: 'Your Order can not be fetched at this time. Please check in your profile instead.',
    responseStatus: 404,
  };
  return customizedErrorObject;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
  jwtVerificationErrorHandler,
  vendorAuthorizationErrorHandler,
  teamFetchErrorHandler,
  userRegisterErrorHandler,
  userSignInErrorHandler,
  savedTeamsFetchErrorHandler,
  selectedTeamFetchErrorHandler,
  usernameUpdateErrorHandler,
  profileFetchingErrorHandler,
  createOrUpdateAddressErrorHandler,
  deleteAddressErrorHandler,
  saveNewTeamErrorHandler,
  deleteSavedTeamErrorHandler,
  joinTeamAndCreateNewOrderErrorHandler,
  addressFetchingErrorHandler,
  orderFetchErrorHandler,
};
