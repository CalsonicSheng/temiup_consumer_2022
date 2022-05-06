import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import { authSliceSyncActions } from '../../data/slices/authSlice';
import AddressForm from '../../components/address_form/AddressForm';
import AddressCard from '../../components/address_card/AddressCard';
import { addressSliceSyncActions, getTargetUserAddressesRequestHandler } from '../../data/slices/addressSlice';

export default function ProfileAddressesScreen() {
  const { isAddressesStateLoading, isCRUDLoading, CRUDResultState, addressSliceJwtVerificationState, addressesState } = useSelector((state) => {
    return state.addressReducer;
  });

  const [addAddress, setAddAddress] = useState(false);

  const [editAddress, setEditAddress] = useState(false);

  const [selectedEditingAddressInfo, setSelectedEditingAddressInfo] = useState({});

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //------------------------------------------------------------------------------------------------------------------------------

  function enableAddAddressHandler() {
    // turn "addAddress" to true ONLY | and reset CRUD result always
    setAddAddress(true);
    setEditAddress(false);
    dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
  }

  function enableEditAddressHandler(selectedAddressInfoInput) {
    // turn "editAddres" to true ONLY | and reset CRUD result always
    setAddAddress(false);
    setEditAddress(true);
    setSelectedEditingAddressInfo(selectedAddressInfoInput);
    dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
  }

  function disableAddOrEditAddressHandler() {
    // turn "addAddress" and "editAddress" to false | and reset CRUD result always (this is mainly to reset CRUD result when it is "error")
    setAddAddress(false);
    setEditAddress(false);
    dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
  }

  // get user address list automatically upon user navigating here
  useEffect(() => {
    dispatch(getTargetUserAddressesRequestHandler());
  }, [dispatch]);

  // handle JWT error state here
  useEffect(() => {
    if (addressSliceJwtVerificationState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
      navigate('/auth/signin', { state: '/profile/addresses' });
    }
  }, [addressSliceJwtVerificationState, dispatch, navigate]);

  useEffect(() => {
    if (CRUDResultState.data) {
      // conduct this automatically for "data" case since we want to immediately bring user back to main address page
      setAddAddress(false);
      setEditAddress(false);
      dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
    }
  }, [CRUDResultState]);

  // clear and reset "CRUDResultState" state upon unmounting
  useEffect(() => {
    return () => {
      dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
      dispatch(addressSliceSyncActions.resetJwtVerificationStateHandler());
    };
  }, [dispatch]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isAddressesStateLoading ? (
        <LoadingMessageBox>
          <h5 className="m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : addressesState.data ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-5">
            {/* page title ----------------------------------------------------------------------------------------- */}
            <h2 className={`p-0 m-0 fw-bold`}>My Addresses</h2>

            {/* add / cancel address button ----------------------------------------------------------------------------------------- */}
            {addAddress || editAddress ? (
              <button type="button" className="btn btn-outline-info px-4 py-2 radius-custom" onClick={disableAddOrEditAddressHandler}>
                <h6 className="p-0 m-0 fw-bold"> Cancel</h6>
              </button>
            ) : (
              <button type="button" className="btn btn-outline-info px-4 py-2 radius-custom" onClick={enableAddAddressHandler}>
                <h6 className="p-0 m-0 fw-bold">Add address</h6>
              </button>
            )}
          </div>

          {/* case 1: no address yet ----------------------------------------------------------------------------------------- */}

          {addressesState.data.targetUserAddressCount === 0 && addAddress === false && editAddress === false ? (
            <div className="w-75 pe-5">
              <WarningMessageBox>
                <h5 className="m-0 p-0 text-danger">You have no saved shipping addresses yet</h5>
              </WarningMessageBox>
            </div>
          ) : // case 2: have address ----------------------------------------------------------------------------------------------
          addressesState.data.targetUserAddressCount !== 0 && addAddress === false && editAddress === false ? (
            <>
              {CRUDResultState.error && (
                <ErrorMessageBox marginSetting="mb-4">
                  <h5 className="m-0 p-0">{CRUDResultState.error.customizedMessage}</h5>
                </ErrorMessageBox>
              )}
              <div className="row gx-5 gy-4">
                {addressesState.data.targetUserAddressList.map((e) => {
                  return (
                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex align-items-stretch" key={e._id}>
                      <AddressCard eachAddressInfo={e} enableEditAddressHandler={enableEditAddressHandler} />
                    </div>
                  );
                })}
              </div>
            </>
          ) : // case 3: adding address is enabled ----------------------------------------------------------------------------------------------
          addressesState.data && addAddress === true && editAddress === false ? (
            <AddressForm isCRUDLoading={isCRUDLoading} CRUDResult={CRUDResultState} formWidthPercentage={'w-75'} paddingEnd={'pe-5'} isInCheckOutScreen={false} />
          ) : // case 4: editing address is enabled ----------------------------------------------------------------------------------------------
          addressesState.data && addAddress === false && editAddress === true ? (
            <AddressForm
              isCRUDLoading={isCRUDLoading}
              CRUDResult={CRUDResultState}
              selectedEditingAddressInfo={selectedEditingAddressInfo}
              formWidthPercentage={'w-75'}
              paddingEnd={'pe-5'}
              isInCheckOutScreen={false}
            />
          ) : (
            <></>
          )}
        </>
      ) : addressesState.error && addressesState.error.customizedMessage ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">{addressesState.error.customizedMessage}</h5>
        </ErrorMessageBox>
      ) : (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Something went wrong from our end</h5>
        </ErrorMessageBox>
      )}
    </>
  );
}
