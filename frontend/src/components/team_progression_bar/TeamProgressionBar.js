import React from 'react';
import classes from './customStyle.module.css';

export default function TeamProgressionBar({ totalTeamSize, currentTeamSize }) {
  const progressionBarWidthPercentage = (currentTeamSize / totalTeamSize) * 100 + '%';

  return (
    <>
      <div className={`w-100 radius-custom bg-white ${classes['outer-bar-custom']}`}>
        <div className={`radius-custom bg-success p-0 zindex-dropdown ${classes['progression-bar-custom']}`} style={{ width: progressionBarWidthPercentage }}>
          <div className={classes['wave-motion']}></div>
        </div>
        <p className={`m-0 text-dark ${classes['size-track-custom']}`}>{`${currentTeamSize}/${totalTeamSize}`}</p>
      </div>
    </>
  );
}
