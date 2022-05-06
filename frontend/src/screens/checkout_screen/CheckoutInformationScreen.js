import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authSliceSyncActions } from '../../data/slices/authSlice.js';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import UserInput from '../../components/user_input/UserInput';
import AddressForm from '../../components/address_form/AddressForm';
import TeamProgressionBar from '../../components/team_progression_bar/TeamProgressionBar.js';
import { getSelectedTeamRequestHandler } from '../../data/slices/teamSlice.js';
import { orderSliceSyncActions } from '../../data/slices/orderSlice.js';
import { addressSliceSyncActions, getTargetUserAddressesRequestHandler, getTargetUserNewestAddressRequestHandler } from '../../data/slices/addressSlice.js';
import { getTargetUserRequestHandler, userSliceSyncActions } from '../../data/slices/userSlice';

export default function CheckoutInformationScreen() {
  const selectedTeamId = useParams().selectedTeamId;

  const { isSavedTeamStateLoading, selectedTeamState } = useSelector((state) => {
    return state.teamReducer;
  });

  const { userState, isUserStateLoading, userSliceJwtVerificationState } = useSelector((state) => {
    return state.userReducer;
  });

  const { addressesState, isAddressesStateLoading, CRUDResultState, addressSliceJwtVerificationState, newestAddressState, isCRUDLoading } = useSelector((state) => {
    return state.addressReducer;
  });

  const { selectedQtyState } = useSelector((state) => {
    return state.orderReducer;
  });

  const [addNewAddressToggleState, setAddNewAddressToggleState] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //----------------------------------------------------------------------------------------------------------------------------------------------

  function targetUserAddresOptionGenerationHandler() {
    if (addressesState.data) {
      const addressOptionList = addressesState.data.targetUserAddressList.map((e) => {
        return (
          <option value={JSON.stringify(e)} key={e._id}>
            {e.addressSummary}
          </option>
        );
      });
      return addressOptionList;
    }
  }

  function setOrderShippingAddressInputHandler(e) {
    const parsedOrderAddressObject = JSON.parse(e.target.value); // need to parse this "select" tag value since they always default all value to STRING FIRST under option tag
    dispatch(orderSliceSyncActions.setOrderShippingAddressStateHandler(parsedOrderAddressObject));
  }

  function setOrderContactEmailInputHandler(e) {
    dispatch(orderSliceSyncActions.setOrderContactEmailStateHandler(e.target.value));
  }

  function enableAddNewAddressHandler() {
    dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
    setAddNewAddressToggleState(true);
  }

  function disableAddNewAddressHandler() {
    dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
    setAddNewAddressToggleState(false);
  }

  // set orderShippingAddress once "addressinfo" data is fetched initially
  useEffect(() => {
    if (addressesState.data) {
      dispatch(orderSliceSyncActions.setOrderShippingAddressStateHandler(addressesState.data.targetUserAddressList[0]));
    }
  }, [addressesState.data, dispatch]);

  // set orderContractEmail once "user" data is fetched initially
  useEffect(() => {
    if (userState.data) {
      dispatch(orderSliceSyncActions.setOrderContactEmailStateHandler(userState.data.email));
    }
  }, [userState.data, dispatch]);

  // upon mounting the component, we fetch all necessary information (all 3 data categories)
  useEffect(() => {
    dispatch(getTargetUserRequestHandler());
    dispatch(getTargetUserAddressesRequestHandler());
    dispatch(getSelectedTeamRequestHandler(selectedTeamId));
  }, [dispatch, selectedTeamId]);

  // handle JWT error state
  useEffect(() => {
    if (userSliceJwtVerificationState.error && addressSliceJwtVerificationState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
      navigate('/auth/signin', { state: `/checkout-information/${selectedTeamId}` });
    }
  }, [userSliceJwtVerificationState, addressSliceJwtVerificationState, selectedTeamId, dispatch, navigate]);

  // code runs automatically upon sucessful address adding (you must realize only "address-adding-action" will set "CRUDResultState.data" in this page)
  // we then must obtain the newest added address to carry out to the next page
  useEffect(() => {
    if (CRUDResultState.data) {
      dispatch(getTargetUserNewestAddressRequestHandler());
      if (newestAddressState.data) {
        dispatch(orderSliceSyncActions.setOrderShippingAddressStateHandler(newestAddressState.data));
        navigate(`/checkout-confirmation/${selectedTeamId}`);
      }
    }
  }, [CRUDResultState, navigate, dispatch, newestAddressState, selectedTeamId]);

  // clear and reset all necessary states upon leaving component (all jwt error states and CRUDResultState states)
  useEffect(() => {
    return () => {
      dispatch(userSliceSyncActions.resetJwtVerificationStateHandler());
      dispatch(addressSliceSyncActions.resetJwtVerificationStateHandler());
      dispatch(addressSliceSyncActions.resetNewestAddressHandler());
      dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
      setAddNewAddressToggleState(false);
    };
  }, [dispatch]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isSavedTeamStateLoading || isUserStateLoading || isAddressesStateLoading ? (
        <LoadingMessageBox>
          <h5 className="d-inline m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : selectedTeamState.data && userState.data && addressesState.data ? (
        <div className="row">
          {/* left side (contact info and shipping info data input and confirm) ----------------------------------------------------------------------*/}
          <div className={`col-lg-7 col-md-7 pe-5`}>
            <span>Team detail</span>
            <i className="fa-solid fa-chevron-right mx-2" />
            <span style={{ textDecoration: 'underline' }}>Shipping information</span>
            <i className="fa-solid fa-chevron-right mx-2" />
            <span>Confirmation</span>

            {/* contact info input --------------------------------------------------------------------------- */}

            <h3 className="mb-3 fw-bold mt-5">Contact information</h3>
            <label htmlFor="inputForEmail" className="form-label mb-1 p-0">
              <span>Contact Email</span>
            </label>
            <UserInput type="email" defaultValue={userState.data.email} id="inputForEmail" onChangeFunction={setOrderContactEmailInputHandler} />

            {/* shipping info input fields below ------------------------------------------------------- */}

            <h3 className={`fw-bold mt-5 mb-3`}>Shipping information</h3>

            {/* if no address is found for this user yet------------------------------------------------ */}
            {addressesState.data.targetUserAddressCount === 0 ? (
              <>
                <WarningMessageBox marginSetting="mb-4">
                  <h6 className="m-0 p-0 fw-bold text-danger">You have no saved addresses yet. Start Adding</h6>
                </WarningMessageBox>
                <Link to={`/selected-team/${selectedTeamId}`} className={`link-custom`}>
                  <div className="mb-3">
                    <i className="fa-solid fa-chevron-left me-2" />
                    <span>Back to team detail</span>
                  </div>
                </Link>
                <AddressForm isCRUDLoading={isCRUDLoading} CRUDResult={CRUDResultState} formWidthPercentage={'w-100'} paddingEnd={'pe-0'} isInCheckOutScreen={true} />
              </>
            ) : (
              <>
                <select className="form-select bg-light text-dark w-100 radius-custom mb-3" onChange={setOrderShippingAddressInputHandler} defaultValue={addressesState.data.targetUserAddressList[0]}>
                  {targetUserAddresOptionGenerationHandler()}
                </select>
                <div className="mt-5 d-flex justify-content-between align-items-center">
                  <Link to={`/selected-team/${selectedTeamId}`} className="link-custom">
                    <div>
                      <i className="fa-solid fa-chevron-left me-2" />
                      <span>Back to team detail</span>
                    </div>
                  </Link>
                  <div>
                    {addNewAddressToggleState ? (
                      <button type="button" className=" btn btn-outline-info py-2 px-3 radius-custom " onClick={disableAddNewAddressHandler}>
                        <span className="p-0 m-0 fw-bold">Cancel adding</span>
                      </button>
                    ) : (
                      <button type="button" className=" btn btn-outline-info py-2 px-3 radius-custom me-4" onClick={enableAddNewAddressHandler}>
                        <span className="p-0 m-0 fw-bold">Add new address</span>
                      </button>
                    )}
                    {addNewAddressToggleState ? (
                      <></>
                    ) : (
                      <Link to={`/checkout-confirmation/${selectedTeamId}`}>
                        <button type="button" className=" btn btn-outline-info py-2 px-3 radius-custom ">
                          <span className="p-0 m-0 fw-bold"> Continue</span>
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  {addNewAddressToggleState && <AddressForm isCRUDLoading={isCRUDLoading} CRUDResult={CRUDResultState} formWidthPercentage={'w-100'} paddingEnd={'pe-0'} isInCheckOutScreen={true} />}
                </div>
              </>
            )}
          </div>

          {/* right side (team confirmation info) -------------------------------------------------------------------------------------------------- */}

          <div className="col ps-5">
            <div className="d-flex justify-content-between align-items-center">
              <img src={selectedTeamState.data.image} className={`card-img-top radius-custom w-25 img-custom`} alt="..." />
              <div>
                <h6 className="mb-2 p-0 fw-bold">{selectedTeamState.data.productName}</h6>
                <h6 className="mb-2 p-0 fw-bold">Qty: {selectedQtyState}</h6>
                <div className="mt-2">
                  <TeamProgressionBar currentTeamSize={selectedTeamState.data.currentTeamSize} totalTeamSize={selectedTeamState.data.totalTeamSize} />
                </div>
              </div>
              <div>
                <h6 className="line-through-decoration fw-bold mb-2 p-0">${selectedTeamState.data.originalPrice}</h6>
                <h6 className="text-warning fw-bold m-0 p-0">${selectedTeamState.data.teamDiscountedPrice}</h6>
              </div>
            </div>
            <div className="bg-info w-100 radius-custom my-5" style={{ height: '5px' }}></div>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="m-0 p-0 fw-bold">Total</h4>
              <h4 className="m-0 p-0 fw-bold">${selectedTeamState.data.teamDiscountedPrice * selectedQtyState}</h4>
            </div>
          </div>
        </div>
      ) : userState.error || addressesState.error ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Your resources can not be fetched at this time. Please try again later</h5>
        </ErrorMessageBox>
      ) : (
        <></>
      )}
    </>
  );
}
