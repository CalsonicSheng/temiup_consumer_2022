import React from 'react';
import classes from './customStyle.module.css';

export default function JoinedTeamAvatars({ joinedMemberList }) {
  const localJoinedMemberList = [...joinedMemberList];
  return (
    <>
      {localJoinedMemberList.length > 5 ? (
        // when localJoinedMemberList length is > 5 ------------------------------------------------------
        <div className={`${classes['avatars']}`}>
          {localJoinedMemberList.splice(0, 5).map((e) => {
            return (
              // the key prop setting here is to counter the popluate vs non-populate case on "detail" field in each element in the "localJoinedMemberList"
              <div className={`${classes['avatar-custom-more-than-5']} bg-warning`} key={e._id}>
                <span className=" fw-bold">{e.name[0].toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      ) : (
        //when localJoinedMemberList length is <= 5 -----------------------------------------------------
        <div className={`${classes['avatars']}`}>
          {localJoinedMemberList.map((e) => {
            return (
              // the key prop setting here is to counter the popluate vs non-populate case on "detail" field in each element in the "localJoinedMemberList"
              <div className={`${classes['avatar-custom']} bg-warning`} key={e._id}>
                <span className=" fw-bold">{e.name[0].toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
