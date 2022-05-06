import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox';
import TeamProgressionBar from '../../components/team_progression_bar/TeamProgressionBar';
import { authSliceSyncActions } from '../../data/slices/authSlice';
import { joinTeamAndCreateNewOrderRequestHandler, orderSliceSyncActions } from '../../data/slices/orderSlice';
import { getSelectedTeamRequestHandler } from '../../data/slices/teamSlice';
import customClasses from './customStyle.module.css';

export default function CheckoutConfirmationScreen() {
  const selectedTeamId = useParams().selectedTeamId;

  const { isCRUDLoading, CRUDResultState, orderSliceJwtVerificationState, orderContactEmailState, orderShippingAddressState, selectedQtyState } = useSelector((state) => {
    return state.orderReducer;
  });

  const { isSelectedTeamStateLoading, selectedTeamState } = useSelector((state) => {
    return state.teamReducer;
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //------------------------------------------------------------------------------------------------------------------

  function joinTeamAndCreateNewOrderHandler() {
    dispatch(joinTeamAndCreateNewOrderRequestHandler({ selectedTeamId, requestBodyObject: { selectedQtyState, orderShippingAddressState, orderContactEmailState } }));
  }

  useEffect(() => {
    dispatch(getSelectedTeamRequestHandler(selectedTeamId));
  }, [dispatch, selectedTeamId]);

  // handler jwt error state
  useEffect(() => {
    if (orderSliceJwtVerificationState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
      navigate('/auth/signin', { state: `/checkout-confirmation/${selectedTeamId}` });
    }
  }, [orderSliceJwtVerificationState.error, selectedTeamId, dispatch, navigate]);

  // automatically redirect to either success or error order placement result page
  useEffect(() => {
    if (CRUDResultState.data) {
      navigate('/order/success');
    }
    if (CRUDResultState.error) {
      navigate('/order/error');
    }
  }, [dispatch, navigate, CRUDResultState]);

  // clear and reset JWT and CRUDResultState when unmount
  useEffect(() => {
    return () => {
      dispatch(orderSliceSyncActions.resetCRUDResultStateHandler());
      dispatch(orderSliceSyncActions.resetJwtVerificationStateHandler());
    };
  }, [dispatch]);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isSelectedTeamStateLoading ? (
        <LoadingMessageBox>
          <h5 className="d-inline m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : selectedTeamState.data ? (
        <div className="row">
          {/* left side (contact info and shipping info data input and confirm) ----------------------------------------------------------------------*/}
          <div className={`col-lg-7 col-md-7 pe-5`}>
            {/* progression step ------------------------------------------------------------------------------------------------ */}
            <span>Team detail</span>
            <i className="fa-solid fa-chevron-right mx-2" />
            <span>Shipping information</span>
            <i className="fa-solid fa-chevron-right mx-2" />
            <span style={{ textDecoration: 'underline' }}>Confirmation</span>

            {/* information confirm ------------------------------------------------------------------------------------------------ */}

            <ul className={`list-group radius-custom my-5 border border-info ${customClasses['list-group-border']} list-group-item-custom `}>
              <li className={`list-group-item  py-3 list-group-item-custom p-0 mx-4 ${customClasses['list-item-border']}`}>
                <h6 className="m-0 fw-bold d-inline me-2">Contact:</h6>
                <span>{orderContactEmailState}</span>
              </li>
              <li className={`list-group-item  py-3 list-group-item-custom p-0 mx-4`}>
                <h6 className="m-0 fw-bold d-inline me-2">Ship to:</h6>
                <span>{orderShippingAddressState.addressSummary.slice(0, orderShippingAddressState.addressSummary.indexOf('('))}</span>
              </li>
            </ul>

            {/* action button group ------------------------------------------------------------------------------------------------ */}

            <div className="d-flex justify-content-between align-items-center">
              <Link to={`/checkout-information/${selectedTeamId}`} className={`link-custom`}>
                <div>
                  <i className="fa-solid fa-chevron-left me-2" />
                  <span>Back to shipping information</span>
                </div>
              </Link>

              {isCRUDLoading ? (
                <button type="button" className="btn btn-outline-info py-2 radius-custom" style={{ width: '20%' }} disabled={true}>
                  <LoadingSpinner heightValue="18px" widthValue="18px" />
                </button>
              ) : (
                <button type="button" className=" btn btn-outline-info py-2  radius-custom " style={{ width: '20%' }} onClick={joinTeamAndCreateNewOrderHandler}>
                  <span className="p-0 m-0 fw-bold">confirm</span>
                </button>
              )}
            </div>
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
      ) : selectedTeamState.error && selectedTeamState.error.customizedMessage ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Resources can not be fetched at this time. Please try again later</h5>
        </ErrorMessageBox>
      ) : (
        <></>
      )}
    </>
  );
}
