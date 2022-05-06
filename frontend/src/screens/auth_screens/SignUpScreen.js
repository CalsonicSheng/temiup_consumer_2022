import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import UserInput from '../../components/user_input/UserInput';
import { authSliceSyncActions, userRegisterRequestHandler } from '../../data/slices/authSlice';
import { getTargetUserRequestHandler } from '../../data/slices/userSlice';

export default function SignUpScreen() {
  const { isAuthStateLoading, authState } = useSelector((state) => {
    return state.authReducer;
  });

  const previousPath = useLocation().state || '/';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  //------------------------------------------------------------------------------------------------

  function usernameInputHandler(e) {
    setUsernameInput(e.target.value);
  }

  function setEmailInputHandler(e) {
    setEmailInput(e.target.value);
  }

  function setPasswordInputHandler(e) {
    setPasswordInput(e.target.value);
  }

  function setConfirmPasswordInputHandler(e) {
    setConfirmPasswordInput(e.target.value);
  }

  function userRegisterHandler() {
    if (confirmPasswordInput === passwordInput) {
      setShowPasswordMismatch(false);
      dispatch(userRegisterRequestHandler({ username: usernameInput, email: emailInput, password: passwordInput }));
    } else {
      setShowPasswordMismatch(true);
    }
  }

  useEffect(() => {
    if (authState.data) {
      dispatch(getTargetUserRequestHandler());
      navigate(previousPath);
    }
  }, [navigate, previousPath, authState, dispatch]);

  // this is only called ONCE upon mounted if auth is in error
  useEffect(() => {
    if (authState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
    }
  }, [dispatch]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="container w-50">
        {/* Signin Title------------------------------------------------------------------------------------------- */}
        <h2 className="fw-bold ">Sign Up</h2>
        <form>
          {/* username input ------------------------------------------------------------------------------------ */}

          <div className="mt-5">
            <label htmlFor="inputForUsername" className="form-label mb-3">
              Username
            </label>

            {authState.error && authState.error.username && <ErrorMessageBox marginSetting={'mb-3'}>{<span>{authState.error.username}</span>}</ErrorMessageBox>}

            <UserInput type="text" id="inputForUsername" placeholder="Write your username" onChangeFunction={usernameInputHandler} />
          </div>
          {/* email user input ------------------------------------------------------------------------------------ */}
          <div className="mt-5">
            <label htmlFor="inputForEmail" className="form-label mb-3">
              Email Address
            </label>
            {/* empty email error-------------------------------------------------------- */}
            {authState.error && authState.error.email && <ErrorMessageBox marginSetting={'mb-3'}>{<span>{authState.error.email}</span>}</ErrorMessageBox>}
            {/* duplicated email error-------------------------------------------------------- */}
            {authState.error && authState.error.customizedMessage && <ErrorMessageBox marginSetting={'mb-3'}>{<span>{authState.error.customizedMessage}</span>}</ErrorMessageBox>}
            <UserInput type="email" id="inputForEmail" placeholder="Please enter your email" onChangeFunction={setEmailInputHandler} />
          </div>
          <small className="form-text text-muted">We'll never share your email with anyone else.</small>
          {/* password user input ------------------------------------------------------------------------------------ */}

          <div className="mt-5">
            <label htmlFor="inputForPassword" className="form-label mb-3">
              Password
            </label>

            {authState.error && authState.error.password && <ErrorMessageBox marginSetting={'mb-3'}>{<span>{authState.error.password}</span>}</ErrorMessageBox>}

            <UserInput type="password" id="inputForPassword" placeholder="Please enter your password" onChangeFunction={setPasswordInputHandler} />

            <div className="mt-3"></div>

            {showPasswordMismatch && <ErrorMessageBox marginSetting={'mb-3'}>{<span>Your password does not match</span>}</ErrorMessageBox>}

            <UserInput type="password" placeholder="confirm your password" onChangeFunction={setConfirmPasswordInputHandler} />
          </div>
          {/* back to sign in page ------------------------------------------------------------------------------------ */}
          <div className="mt-3">
            <span>Already have an account?</span>
            <Link to="/auth/signin" className={`ms-2 link-custom`} state={previousPath}>
              <span>sign in now</span>
            </Link>
          </div>
          {/* register button ----------------------------------------------------------------------------------------------*/}

          {isAuthStateLoading ? (
            <button type="button" className="btn btn-outline-info mt-5 radius-custom text-center" style={{ width: '20%' }} disabled={true}>
              <LoadingSpinner heightValue="18px" widthValue="18px" />
            </button>
          ) : (
            <button type="button" className="btn btn-outline-info mt-5 radius-custom text-center" style={{ width: '20%' }} onClick={userRegisterHandler}>
              <span className="p-0 m-0 fw-bold">Sign Up</span>
            </button>
          )}
        </form>
      </div>
    </>
  );
}
