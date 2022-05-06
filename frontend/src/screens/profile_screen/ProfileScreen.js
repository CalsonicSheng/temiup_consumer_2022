import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import OrderCard from '../../components/order_card/OrderCard';
import UserInput from '../../components/user_input/UserInput';
import { authSliceSyncActions } from '../../data/slices/authSlice';
import { getTargetUserOrderRequestHandler, orderSliceSyncActions } from '../../data/slices/orderSlice';
import { getTargetUserRequestHandler, updateTargetUserRequestHandler, userSliceSyncActions } from '../../data/slices/userSlice';
import customClasses from './customStyle.module.css';

export default function ProfileScreen() {
  const { isUserStateLoading, isCRUDLoading, CRUDResultState, userState, userSliceJwtVerificationState } = useSelector((state) => {
    return state.userReducer;
  });

  const { isOrdersStateLoading, ordersState, orderSliceJwtVerificationState } = useSelector((state) => {
    return state.orderReducer;
  });

  const [editUsername, setEditUsername] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //---------------------------------------------------------------------------------------------

  function enableEditUsernameHandler() {
    setEditUsername(true);
  }

  function disableEditUsernameHandler() {
    setEditUsername(false);
    dispatch(userSliceSyncActions.CRUDResultResetHandler());
  }

  function setNewUsernameInputHandler(e) {
    setNewUsernameInput(e.target.value);
  }

  // when update button clicked, send out update request through axios | and also "setEditUsername" to false
  function updateUsernameHandler() {
    dispatch(updateTargetUserRequestHandler({ requestBodyObject: { newUsernameInput } }));
  }

  // fetch two core states upon page component mount automatically
  useEffect(() => {
    dispatch(getTargetUserRequestHandler());
    dispatch(getTargetUserOrderRequestHandler());
  }, [dispatch]);

  // handle jwt error state
  useEffect(() => {
    if (orderSliceJwtVerificationState.error && userSliceJwtVerificationState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
      navigate('/auth/signin', { state: '/profile' });
    }
  }, [dispatch, navigate, orderSliceJwtVerificationState, userSliceJwtVerificationState]);

  // auto carryout further action when crud operation is successful
  useEffect(() => {
    if (CRUDResultState.data) {
      setEditUsername(false);
      dispatch(userSliceSyncActions.resetCRUDResultStateHandler());
    }
  }, [CRUDResultState, dispatch]);

  // clear and reset "CRUDResultState" and "jwfVerification" state upon unmounting
  useEffect(() => {
    return () => {
      dispatch(userSliceSyncActions.resetCRUDResultStateHandler());
      dispatch(userSliceSyncActions.resetJwtVerificationStateHandler());
      dispatch(orderSliceSyncActions.resetJwtVerificationStateHandler());
    };
  }, [dispatch]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isUserStateLoading || isOrdersStateLoading ? (
        <LoadingMessageBox>
          <h5 className="m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : userState.data && ordersState.data ? (
        <>
          {/* profile page title ---------------------------------------------------------------------------------------------------------- */}
          <h2 className={`p-0 fw-bold mb-5`}>My account</h2>
          <div className="row">
            {/* team history -------------------------------------------------------------------------------------------------------------- */}
            <div className={`col-lg-8 ${customClasses['team-history-div-custom']}`}>
              <h4 className={`p-0 m-0 mb-4 fw-bold `}>Team order History</h4>
              {ordersState.data.targetUserOrderDocCount === 0 ? (
                <WarningMessageBox>
                  <h5 className="m-0 p-0 text-danger">You have no team order history yet</h5>
                </WarningMessageBox>
              ) : (
                <div>
                  {ordersState.data.targetUserOrderList.map((e) => {
                    return <OrderCard key={e._id} eachOrderInfo={e} />;
                  })}
                </div>
              )}
            </div>

            {/* account detail ---------------------------------------------------------------------------------------------------------------- */}
            <div className="col">
              <h4 className="p-0 m-0 mb-4 fw-bold">Account detail</h4>

              {/* potential crud error message ------------------------------------------------------------------------------------------------ */}
              {CRUDResultState.error && (
                <ErrorMessageBox marginSetting={'my-3'}>
                  <h6 className="m-0 p-0">{CRUDResultState.error.customizedMessage}</h6>
                </ErrorMessageBox>
              )}

              <ul className={`list-group radius-custom `}>
                {/* username ------------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item py-3 list-group-item-custom`}>
                  <h6 className="m-0 p-0 fw-bold mb-2">Username:</h6>

                  <div className="d-flex justify-content-between align-items-center">
                    {editUsername ? (
                      <>
                        <UserInput defaultValue={userState.data.username} onChangeFunction={setNewUsernameInputHandler} type="text" />
                        <div className="ms-5">
                          {isCRUDLoading ? (
                            <button type="button" className="btn btn-outline-info px-3 py-1 w-100 radius-custom mb-3 " style={{ width: '25%' }} disabled={true}>
                              <LoadingSpinner heightValue="18px" widthValue="18px" />
                            </button>
                          ) : (
                            <button type="button" className="btn btn-outline-info px-3 py-1 w-100 radius-custom mb-3" style={{ width: '25%' }} onClick={updateUsernameHandler}>
                              Update
                            </button>
                          )}

                          <button type="button" className="btn btn-outline-info px-3 py-1 w-100 radius-custom" onClick={disableEditUsernameHandler}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h6 className="p-0 m-0">{userState.data.username}</h6>
                        <button type="button" className="btn btn-outline-info px-3 py-1 radius-custom" style={{ width: '25%' }} onClick={enableEditUsernameHandler}>
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </li>
                {/* email ------------------------------------------------------------------------------------------------------------------- */}

                <li className={`list-group-item py-3 list-group-item-custom`}>
                  <h6 className="m-0 p-0 fw-bold mb-2">Email:</h6>
                  <h6 className="p-0 m-0">{userState.data.email}</h6>
                </li>
                {/* view addresses ------------------------------------------------------------------------------------------------------------------- */}

                <li className={`list-group-item py-3 list-group-item-custom`}>
                  <h6 className="m-0 p-0 fw-bold mb-2">Address:</h6>
                  <Link to={'/profile/addresses'}>
                    <h6 className="p-0 m-0">View addresses ({userState.data.totalShippingAddressCount})</h6>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : userState.error || ordersState.error ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Your resources can not be fetched at this time. Please try again later</h5>
        </ErrorMessageBox>
      ) : (
        <></>
      )}
    </>
  );
}
