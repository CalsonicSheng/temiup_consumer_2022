import React from 'react';
import { Link } from 'react-router-dom';
import CountDown from '../count_down/CountDown';
import JoinedTeamAvatars from '../joined_team_avatars/JoinedTeamAvatars';
import TeamProgressionBar from '../team_progression_bar/TeamProgressionBar';

export default function HomeTeamCard({ teamInfo }) {
  return (
    <div className={`card border-info p-3 radius-custom`}>
      {/* product source --------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="mb-2">
        <span>Listed By:</span>
        <i className="fa-brands fa-shopify text-success ms-2"></i>
        <a className={`text-success ms-2 link-custom `} href="https://www.google.com">
          {teamInfo.vendor.name.length >= 30 ? teamInfo.vendor.name.substring(0, 28) + '...' : teamInfo.vendor.name}
        </a>
      </div>

      {/* product image ------------------------------------------------------------------------------------------------------------------------------------- */}
      <div className={`radius-custom`}>
        <img src={teamInfo.image} className={`card-img-top radius-custom img-custom`} alt="..." />
      </div>

      <div className={`card-body p-0 mt-2`}>
        {/* product name --------------------------------------------------------------------------------------------------------------------------------- */}

        <h6 className="card-title m-0 fw-bold">{teamInfo.productName.length >= 60 ? teamInfo.productName.substring(0, 59) + ' ...' : teamInfo.productName}</h6>

        {/* product price  ---------------------------------------------------------------------------------------------------------------------------------*/}

        <div className="mt-1 d-flex align-items-center p-0">
          <h5 className="d-inline fw-bold">${teamInfo.teamDiscountedPrice}</h5>
          <h6 className="d-inline text-decoration-line-through ms-3 text-light">${teamInfo.originalPrice}</h6>
        </div>

        {/* team member status --------------------------------------------------------------------------------------------------------------------------------- */}

        <div className="mt-3">
          {teamInfo.currentTeamSize === 0 ? (
            <h6 className="d-inline p-0 m-0">Be the first to join</h6>
          ) : teamInfo.currentTeamSize > 5 ? (
            <div>
              <JoinedTeamAvatars joinedMemberList={teamInfo.joinedMemberList} />
              <h6 className="ms-2 d-inline p-0 m-0">and others joined</h6>
            </div>
          ) : (
            <div>
              <JoinedTeamAvatars joinedMemberList={teamInfo.joinedMemberList} />
              <h6 className="ms-2 d-inline p-0 m-0">joined</h6>
            </div>
          )}
        </div>

        {/* team progression status --------------------------------------------------------------------------------------------------------------------------------- */}

        <div className="mt-2">
          <TeamProgressionBar currentTeamSize={teamInfo.currentTeamSize} totalTeamSize={teamInfo.totalTeamSize} />
        </div>

        {/* team remaining time status ---------------------------------------------------------------------------------------------------------------------------- */}

        <div className="d-flex justify-content-between align-items-center mt-1">
          <span>Team Deal Ends In</span>
          <CountDown teamDealEndedAt={teamInfo.teamDealEndedAt} />
        </div>

        {/* join team button ---------------------------------------------------------------------------------------------------------------------------------------- */}

        <Link to={`/selected-team/${teamInfo._id}`}>
          <button className={`btn btn-info mt-3 w-100 radius-custom`}>
            <span className={`m-0`}>Join Team Now</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
