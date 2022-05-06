import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import SavedTeamsCard from '../../components/saved_teams_card/SavedTeamsCard';
import { authSliceSyncActions } from '../../data/slices/authSlice';
import { getSavedTeamsRequestHandler, savedTeamSliceSyncActions } from '../../data/slices/savedTeamSlice';

export default function SavedTeamsScreen() {
  const { isSavedTeamsStateLoading, savedTeamsState, savedTeamSliceJwtVerificationState, CRUDResultState } = useSelector((state) => {
    return state.savedTeamReducer;
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  //---------------------------------------------------------------------------------

  useEffect(() => {
    // user specific id is encypted and stored inside the JWT already
    dispatch(getSavedTeamsRequestHandler());
  }, [dispatch]);

  useEffect(() => {
    if (savedTeamSliceJwtVerificationState.error) {
      dispatch(authSliceSyncActions.authResetOrLogoutHandler());
      navigate('/auth/signin', { state: '/saved-teams' });
    }
  }, [navigate, dispatch, savedTeamSliceJwtVerificationState]);

  useEffect(() => {
    return () => {
      dispatch(savedTeamSliceSyncActions.resetCRUDResultStateHandler());
      dispatch(savedTeamSliceSyncActions.resetJwtVerificationStateHandler());
    };
  }, [dispatch]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isSavedTeamsStateLoading ? (
        <LoadingMessageBox>
          <h5 className="m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : savedTeamsState.data && savedTeamsState.data.savedTeamsCount === 0 ? (
        <>
          <h2 className="fw-bold m-0 p-0 mb-5">All your Saved Teams</h2>
          <WarningMessageBox>
            <h5 className="m-0 p-0 text-danger">You have no saved teams yet</h5>
          </WarningMessageBox>
        </>
      ) : savedTeamsState.data && savedTeamsState.data.savedTeamsCount !== 0 ? (
        <>
          <h2 className="fw-bold ">All your Saved Teams</h2>

          {/* potential deletion error message ------------------------------------------------------------------------------- */}
          {CRUDResultState.error && (
            <ErrorMessageBox marginSetting={'mt-4'}>
              <h6 className="m-0 p-0">{CRUDResultState.error.customizedMessage}</h6>
            </ErrorMessageBox>
          )}
          {/* saved team cards ------------------------------------------------------------------------------- */}
          <div className="row">
            <div className="col-lg col-md-12 me-5">
              {savedTeamsState.data.savedTeamsList.map((e) => {
                return <SavedTeamsCard teamInfo={e} key={e._id} />;
              })}
            </div>
            {/* list group ------------------------------------------------------------------------------- */}

            <div className="col-lg-3 col-md col-sm mt-4 p-0">
              <ul className="list-group radius-custom">
                {/* sub total items count ----------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">Subtotal items: </h6>
                  <h6 className="mb-0 fw-bold">{savedTeamsState.data.savedTeamsCount}</h6>
                </li>
                {/* sub total original price ----------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">total original price: </h6>
                  <h6 className="mb-0 fw-bold text-warning"> {savedTeamsState.data.savedTeamsPriceSummary.totalOriginalPrice} $</h6>
                </li>

                {/* sub total discounted price ----------------------------------------------------------------------------------------------------- */}
                <li className={`list-group-item d-flex justify-content-between align-items-center py-3 list-group-item-custom`}>
                  <h6 className="m-0 fw-bold">total discounted price: </h6>
                  <h6 className="mb-0 fw-bold text-warning"> {savedTeamsState.data.savedTeamsPriceSummary.totalTeamDiscountedPrice} $</h6>
                </li>

                {/* checkout to all button -----------------------------------------------------------------------------------------------------

                <li className={`list-group-item py-3 list-group-item-custom`}>
                  <button type="button" className="btn btn-outline-primary w-100 radius-custom">
                    <h6 className="m-0"> Proceed To Checkout </h6>
                  </button>
                </li> */}
              </ul>
            </div>
          </div>
        </>
      ) : savedTeamsState.error && savedTeamsState.error.customizedMessage ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">{savedTeamsState.error.customizedMessage}</h5>
        </ErrorMessageBox>
      ) : (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Something went wrong from our end</h5>
        </ErrorMessageBox>
      )}
    </>
  );
}
