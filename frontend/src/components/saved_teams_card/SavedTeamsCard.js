import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteOneSavedTeamsRequestHandler, savedTeamSliceSyncActions } from '../../data/slices/savedTeamSlice';
import TeamProgressionBar from '../team_progression_bar/TeamProgressionBar';
import classes from './customStyle.module.css';

export default function SavedTeamsCard({ teamInfo }) {
  const { isCRUDLoading } = useSelector((state) => {
    return state.savedTeamReducer;
  });

  const dispatch = useDispatch();

  //--------------------------------------------------------------

  function deleteTeamHandler() {
    dispatch(deleteOneSavedTeamsRequestHandler(teamInfo._id));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className={`row align-items-center fw-bold border-bottom border-2 border-info py-5 e-5`}>
        {/* product image in the first column------------------------------------------------------------------------------------------------------------- */}

        <div className="col col-lg-3 col-md-4 col-sm-4">
          <img src={teamInfo.image} alt="..." className={'w-100 radius-custom img-custom'} />
        </div>

        {/* product name + team progression + team round info in the second column------------------------------------------------------------------------------ */}

        <div className="col col-lg- col-md col-sm ps-5 text-center">
          <p className="mb-3 fw-bold">{teamInfo.name}</p>
          <TeamProgressionBar currentTeamSize={teamInfo.currentTeamSize} totalTeamSize={teamInfo.totalTeamSize} />
          <div className="mt-3">
            {teamInfo.totalTeamRound - teamInfo.currentTeamRound > 0 ? (
              <h6>{teamInfo.totalTeamRound - teamInfo.currentTeamRound} rounds left</h6>
            ) : teamInfo.totalTeamRound - teamInfo.currentTeamRound === 0 ? (
              <h6 className="text-warning">Last round </h6>
            ) : (
              <h6 className="text-warning">Teaming ended</h6>
            )}
          </div>
        </div>

        {/* product price + go to selectedTeam button in the third column--------------------------------------------------------------------------------------------------------*/}

        <div className="col col-lg-4 col-md-4 col-sm text-center">
          <div className="row align-items-center ">
            <div className="col-sm-12 col-md-6 ">
              <p className="mb-2">${teamInfo.teamDiscountedPrice}</p>
            </div>
            <div className="col-sm-12 col-md-6 ">
              {teamInfo.teamStatus === 'unavailable' ? (
                <button type="button " className="btn btn-outline-info w-100 radius-custom" disabled={true}>
                  <span className="fw-bold m-0 p-0">Unavailable</span>
                </button>
              ) : (
                <Link to={`/selected-team/${teamInfo.teamId}`}>
                  <button type="button " className="btn btn-outline-info w-100 radius-custom">
                    <span className="fw-bold m-0 p-0">Join Now</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* delete button in the last column -----------------------------------------------------------------------------------------------------------------*/}

        <div className="col col-md col-sm text-center">
          {isCRUDLoading ? (
            <button className={`btn ${classes['delete-button-custom']}`} disabled={true}>
              <i className={`fa-solid fa-trash `}></i>
            </button>
          ) : (
            <button className={`btn ${classes['delete-button-custom']}`} onClick={deleteTeamHandler}>
              <i className={`fa-solid fa-trash `}></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
