import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import UserInput from '../../components/user_input/UserInput';
import { authSliceSyncActions, userSiginRequestHandler } from '../../data/slices/authSlice';
import { getTargetUserRequestHandler } from '../../data/slices/userSlice';

// auth screen can only be reached when auth is either in error or {} | this is because if it is in "data", then it will be redirected
export default function SignInScreen() {
  const { isAuthStateLoading, authState } = useSelector((state) => {
    return state.authReducer;
  });

  // the previousPath url are passed into link or navigate's state and access here. If user manually change url, then previousPath state is NOT available, so we just redirect to home.
  const previousPath = useLocation().state || '/';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  //--------------------------------------------------------------------------------------------------

  function setEmailInputHandler(e) {
    setEmailInput(e.target.value);
  }

  function setPasswordInputHandler(e) {
    setPasswordInput(e.target.value);
  }

  function signInHandler() {
    dispatch(userSiginRequestHandler({ email: emailInput, password: passwordInput }));
  }

  useEffect(() => {
    if (authState.data) {
      dispatch(getTargetUserRequestHandler());
      navigate(previousPath);
    }
  }, [navigate, authState, previousPath, dispatch]);

  // this is only called ONCE upon mounted if auth is in error
  useEffect(() => {
    if (authState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
    }
  }, [dispatch]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="container w-50 ">
        {/* Signin Title---------------------------------------------------------------------------------------------------- */}
        <h2 className="fw-bold mb-5">Sign in</h2>

        <form>
          {/* email user input --------------------------------------------------------------------------------------- */}
          <div className="">
            <label htmlFor="inputForEmail" className="form-label mb-3">
              Email Address
            </label>
            <UserInput type="email" id="inputForEmail" placeholder="Please enter your email" onChangeFunction={setEmailInputHandler} />
          </div>
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
          {/* password user input ------------------------------------------------------------------------------------ */}
          <div className="mt-5">
            <label htmlFor="inputForPassword" className="form-label mb-3">
              Password
            </label>
            <UserInput type="password" id="inputForPassword" placeholder="Please enter your password" onChangeFunction={setPasswordInputHandler} />
          </div>
          {/* to sign up user input ------------------------------------------------------------------------------------ */}
          <div className="mt-3">
            <span>Don't have an account?</span>
            <Link to="/auth/signup" className={`ms-2 link-custom`} state={previousPath}>
              <span>sign up now</span>
            </Link>
          </div>

          {/* potential sign in error message ------------------------------------------------------------------------------------------- */}
          {authState.error && (
            <ErrorMessageBox marginSetting={'mt-4'}>
              <span>{authState.error.customizedMessage}</span>
            </ErrorMessageBox>
          )}

          {/* signin button ----------------------------------------------------------------------------------------------*/}

          {isAuthStateLoading ? (
            <button type="button" className="btn btn-outline-info mt-5 radius-custom" style={{ width: '20%' }} disabled={true}>
              <LoadingSpinner heightValue="18px" widthValue="18px" />
            </button>
          ) : (
            <button type="button" className="btn btn-outline-info mt-5 radius-custom" style={{ width: '20%' }} onClick={signInHandler}>
              <span className="fw-bold m-0 p-0">Sign In</span>
            </button>
          )}
        </form>
      </div>
    </>
  );
}
