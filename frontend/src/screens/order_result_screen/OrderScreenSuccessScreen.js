import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import TeamProgressionBar from '../../components/team_progression_bar/TeamProgressionBar';

export default function OrderScreenSuccessScreen() {
  const { newlyPlacedOrderState } = useSelector((state) => {
    return state.orderReducer;
  });

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
      {newlyPlacedOrderState.data ? (
        <div className="d-flex justify-content-center">
          <div className={`card border-info p-3 radius-custom w-25 text-center`}>
            <h5 className="m-0 p-0 fw-bold  mb-3">You have joined !</h5>
            {/* product image ------------------------------------------------------------------------------------------------------------------------------------- */}
            <div className={`radius-custom`}>
              <img src={newlyPlacedOrderState.data.headImage} className={`card-img-top radius-custom img-custom`} alt="..." />
            </div>

            <div className={`card-body p-0 mt-2`}>
              {/* product name --------------------------------------------------------------------------------------------------------------------------------- */}

              <h6 className="card-title m-0 fw-bold">{newlyPlacedOrderState.data.productName}</h6>

              {/* product price  ---------------------------------------------------------------------------------------------------------------------------------*/}

              <h5 className="fw-bold mt-3">${newlyPlacedOrderState.data.totalPaidPrice}</h5>

              {/* team member status --------------------------------------------------------------------------------------------------------------------------------- */}

              <div className="mt-3">
                <h6 className="ms-2 d-inline p-0 m-0">{newlyPlacedOrderState.data.currentTeamSize} joined</h6>
              </div>

              {/* team progression status --------------------------------------------------------------------------------------------------------------------------------- */}

              <div className="mt-2">
                <TeamProgressionBar currentTeamSize={newlyPlacedOrderState.data.currentTeamSize} totalTeamSize={newlyPlacedOrderState.data.totalTeamSize} />
              </div>

              {/* go back home button ---------------------------------------------------------------------------------------------------------------------------------------- */}

              <Link to={'/'}>
                <button type="button" className=" btn btn-outline-info py-2 radius-custom mt-4">
                  <span className="p-0 m-0 fw-bold">Back to Home</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <WarningMessageBox>
            <h6 className="m-0 p-0 fw-bold text-danger">You have not yet made any purchase since last time. Start joining team now</h6>
          </WarningMessageBox>
          <Link to={'/'}>
            <button type="button" className=" btn btn-outline-info py-2 radius-custom mt-4">
              <span className="p-0 m-0 fw-bold">Back to Home</span>
            </button>
          </Link>
        </>
      )}
    </>
  );
}
