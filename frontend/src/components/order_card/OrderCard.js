import React from 'react';
import TeamProgressionBar from '../team_progression_bar/TeamProgressionBar';

export default function OrderCard({ eachOrderInfo }) {
  return (
    <div className="card border-info mb-5 radius-custom w-100">
      <div className="card-header d-flex align-items-center">
        <img src={eachOrderInfo.headImage} className={`card-img-top radius-custom img-custom`} style={{ width: '10%' }} alt="..." />
        <h5 className="text-warning p-0 m-0 ms-4">{eachOrderInfo.productName}</h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <span className="me-1">joined at round: {eachOrderInfo.teamRoundJoinedAt}</span>
          <div className="w-25">
            <TeamProgressionBar currentTeamSize={eachOrderInfo.currentTeamSize} totalTeamSize={eachOrderInfo.totalTeamSize} />
          </div>

          <span>{eachOrderInfo.teamStatus}</span>
          <span>{eachOrderInfo.orderStatus}</span>
          <span>{eachOrderInfo.totalPaidPrice}</span>
          <span>{eachOrderInfo.purchaseQty}</span>
        </div>
      </div>
    </div>
  );
}
