import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RatingStars from '../../components/rating_stars/RatingStars';
import ImageMagnifier from '../../components/image_magnifier/ImageMagnifier.js';
import JoinedTeamAvatars from '../../components/joined_team_avatars/JoinedTeamAvatars.js';
import TeamProgressionBar from '../../components/team_progression_bar/TeamProgressionBar.js';
import CountDown from '../../components/count_down/CountDown.js';
import { useDispatch, useSelector } from 'react-redux';
import { authSliceSyncActions } from '../../data/slices/authSlice';
import { savedTeamSliceSyncActions, saveTeamRequestHandler } from '../../data/slices/savedTeamSlice';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner.js';
import customClasses from './customStyle.module.css';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox.js';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox.js';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import { orderSliceSyncActions } from '../../data/slices/orderSlice';
import { getSelectedTeamRequestHandler } from '../../data/slices/teamSlice';

export default function SelectedTeamScreen() {
  const { isSelectedTeamStateLoading, selectedTeamState } = useSelector((state) => {
    return state.teamReducer;
  });

  const { isCRUDLoading, savedTeamSliceJwtVerificationState, CRUDResultState } = useSelector((state) => {
    return state.savedTeamReducer;
  });

  const { selectedQtyState } = useSelector((state) => {
    return state.orderReducer;
  });

  const selectedTeamId = useParams().selectedTeamId;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //-----------------------------------------------------------------------------------------------------------

  // this is to generate select option tags
  function quantityOptionGenerationHandler(maxQty) {
    const qtyList = [];
    for (let i = 1; i <= maxQty; i++) {
      qtyList.push(i);
    }
    const optionList = qtyList.map((e) => {
      return (
        <option value={e} key={e}>
          {e}
        </option>
      );
    });
    return optionList;
  }

  // this is to handler qty selection state update upon select
  function setSelectedQtyHandler(e) {
    const convertedSelectedQty = Number(e.target.value); // need to convert this "select" tag value since they always default all value to STRING FIRST
    dispatch(orderSliceSyncActions.setSelectedQtyStateHandler(convertedSelectedQty));
  }

  // this will trigger the save team async axios request sending for saving team upon click
  function saveTeamHandler() {
    if (selectedTeamState.data) {
      dispatch(
        saveTeamRequestHandler({
          // userId is assigned in backend server
          teamId: selectedTeamState.data._id,
          productName: selectedTeamState.data.productName,
          image: selectedTeamState.data.image,
          vendor: selectedTeamState.data.vendor,
          originalPrice: selectedTeamState.data.originalPrice,
          teamDiscountedPrice: selectedTeamState.data.teamDiscountedPrice,
          totalTeamSize: selectedTeamState.data.totalTeamSize,
          totalTeamRound: selectedTeamState.data.totalTeamRound,
          currentTeamSize: selectedTeamState.data.currentTeamSize, // this field needs to be real time
          currentTeamRound: selectedTeamState.data.currentTeamRound, // this field needs to be real time
          teamStatus: selectedTeamState.data.teamStatus,
          currency: selectedTeamState.data.currency,
        })
      );
    }
  }

  //run only one time upon selectedTeamScreen is navigated to fetch selected team data and always reset the "SelectedQty" back 1
  useEffect(() => {
    dispatch(getSelectedTeamRequestHandler(selectedTeamId));
    dispatch(orderSliceSyncActions.resetSelectedQtyStateHandler());
  }, [dispatch, selectedTeamId]);

  // this will run if jwt verification process fails when user try to add team to save team
  useEffect(() => {
    if (savedTeamSliceJwtVerificationState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
      navigate('/auth/signin', { state: `/selected-team/${selectedTeamId}` });
    }
  }, [dispatch, savedTeamSliceJwtVerificationState, selectedTeamId, navigate]);

  // this will run once the selected screen is unmounted everytime | this is to always reset the CRUDresult state
  useEffect(() => {
    return () => {
      dispatch(savedTeamSliceSyncActions.resetCRUDResultStateHandler());
      dispatch(savedTeamSliceSyncActions.resetJwtVerificationStateHandler());
    };
  }, [dispatch]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isSelectedTeamStateLoading ? (
        <LoadingMessageBox>
          <h5 className="m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : selectedTeamState.data ? (
        <>
          {/* back to home nav link ----------------------------------------------------------------------------------------------------------------- */}
          <Link to="/" className={`link-custom`}>
            <h3 className="fw-bold m-0 p-0">Back To Home</h3>
          </Link>

          {/* potential last second team unavailable case--------------------------------------------------------------------------------------- */}
          {selectedTeamState.data.teamStatus === 'unavailable' && (
            <WarningMessageBox marginSetting={'mt-4'}>
              <h5 className="m-0 p-0 text-danger">Oops, this team has just finished its last round. You can save this team for future reference</h5>
            </WarningMessageBox>
          )}

          <div className="row mt-4 ">
            {/* image column -------------------------------------------------------------------------------------------------------------------*/}

            <div className="col-xl-5 col-lg-4 col-md-12 col-sm-12 me-5 mb-4">
              <ImageMagnifier imgSrc={selectedTeamState.data.image} />
            </div>

            {/* product / team info column ------------------------------------------------------------------------------------------------------ */}

            <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12 me-5 mb-5">
              <h3 className="fw-bold">{selectedTeamState.data.productName}</h3>
              <div className="my-4">
                <RatingStars rating={selectedTeamState.data.averageRating} />
                <span className="ms-2">{selectedTeamState.data.averageRating} / 5</span>
                <p className="m-0">{selectedTeamState.data.reviewsCount} reviews</p>
              </div>

              <p className="m-0">{selectedTeamState.data.desc}</p>

              <p className="text-warning mt-3"> {selectedTeamState.data.totalTeamSize - selectedTeamState.data.currentTeamSize} more members needed to complete</p>

              <div className="mt-4">
                {selectedTeamState.data.currentTeamSize === 0 ? (
                  <h6 className="d-inline p-0 m-0">Be the first to join</h6>
                ) : (
                  <>
                    <JoinedTeamAvatars joinedMemberList={selectedTeamState.data.joinedMemberList} />
                    <span className="ms-2">have joined</span>
                  </>
                )}
              </div>
              <div className="mt-2">
                <TeamProgressionBar currentTeamSize={selectedTeamState.data.currentTeamSize} totalTeamSize={selectedTeamState.data.totalTeamSize} />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <h6 className="m-0 fw-bold">Team Deal ends in</h6>
                <CountDown teamDealEndedAt={selectedTeamState.data.teamDealEndedAt} />
              </div>
            </div>

            {/* list group and actions column ------------------------------------------------------------------------------------------------------------- */}

            {/* we are not specifying any width fraction for the LAST column here, we let boostrap to auto fill the rest of the width (this is a very powerful trick)  */}
            <div className="col-xl col-lg col-md col-sm">
              <ul className={`list-group radius-custom `}>
                {/* original price ------------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">Original Price</h6>
                  <h6 className="m-0 fw-bold text-decoration-line-through">${selectedTeamState.data.originalPrice}</h6>
                </li>
                {/* team discount price --------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">Team Discount</h6>
                  <h6 className="m-0 fw-bold text-warning">${selectedTeamState.data.teamDiscountedPrice}</h6>
                </li>
                {/* current team round --------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">Team Round</h6>
                  <h6 className="m-0 fw-bold">
                    {selectedTeamState.data.totalTeamRound - selectedTeamState.data.currentTeamRound === 0
                      ? 'Last round'
                      : selectedTeamState.data.totalTeamRound - selectedTeamState.data.currentTeamRound === 1
                      ? `${selectedTeamState.data.totalTeamRound - selectedTeamState.data.currentTeamRound} round left`
                      : selectedTeamState.data.totalTeamRound - selectedTeamState.data.currentTeamRound > 1
                      ? `${selectedTeamState.data.totalTeamRound - selectedTeamState.data.currentTeamRound} rounds left`
                      : 'Team round ends'}
                  </h6>
                </li>
                {/* qty selector ---------------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">Qty</h6>
                  <select className="form-select bg-light text-dark w-50 py-2 px-3 radius-custom py-2 pe-0" onChange={setSelectedQtyHandler} defaultValue={selectedQtyState}>
                    {quantityOptionGenerationHandler(selectedTeamState.data.maxQtyPerCustomer)}
                  </select>
                </li>
                {/* save team button ------------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item py-3 list-group-item-custom`}>
                  {isCRUDLoading ? (
                    <button type="button " className="btn btn-outline-info w-100 radius-custom " disabled={true}>
                      <LoadingSpinner heightValue="18px" widthValue="18px" />
                    </button>
                  ) : CRUDResultState.data ? (
                    <button type="button " className={`btn btn-outline-info w-100 radius-custom position-relative ${customClasses['success-button']}`} disabled={true}>
                      <div className={`${customClasses['progress-bar']}`}></div>
                      <div className={`${customClasses['saved-checkmark']}`}>
                        <span className="fw-bold m-0 p-0 me-2">Saved</span>
                        <i className="fa-solid fa-circle-check fw-bolder"></i>
                      </div>
                    </button>
                  ) : (
                    <button type="button " className="btn btn-outline-info w-100 radius-custom position-relative" onClick={saveTeamHandler}>
                      <span className="fw-bold m-0 p-0 me-2">Save Team</span>
                    </button>
                  )}
                </li>
                {/* Join & Buy Now ---------------------------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item py-3 list-group-item-custom`}>
                  {selectedTeamState.data.teamStatus === 'unavailable' ? (
                    <button type="button" className="btn btn-outline-info w-100 radius-custom" disabled={true}>
                      <span className="m-0 p-0 fw-bold"> Unavailable </span>
                    </button>
                  ) : (
                    <Link to={`/checkout-information/${selectedTeamId}`}>
                      <button type="button" className="btn btn-outline-info w-100 radius-custom">
                        <span className="m-0 p-0 fw-bold">Join & Buy Now </span>
                      </button>
                    </Link>
                  )}
                </li>
              </ul>

              {/* potential save team error ----------------------------------------------------------------------------------------------------------- */}
              {CRUDResultState.error && (
                <ErrorMessageBox marginSetting={'mt-4'}>
                  <h6 className="m-0 p-0">{CRUDResultState.error.customizedMessage}</h6>
                </ErrorMessageBox>
              )}
            </div>
          </div>
        </>
      ) : selectedTeamState.error && selectedTeamState.error.customizedMessage ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">{selectedTeamState.error.customizedMessage}</h5>
        </ErrorMessageBox>
      ) : (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Something went wrong from our end</h5>
        </ErrorMessageBox>
      )}
    </>
  );
}
