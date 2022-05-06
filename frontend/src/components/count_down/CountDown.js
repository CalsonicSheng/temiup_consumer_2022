import React, { useCallback, useEffect, useState } from 'react';

export default function CountDown({ teamDealEndedAt }) {
  const [remainingTimeString, setRemainingTimeString] = useState('');
  const [remainingHr, setRemainingHr] = useState(0);

  //--------------------------------------------------------------------------

  const updateRemainingTime = useCallback(() => {
    const currentTime = Date.now();
    const teamDealEndedAtInMillisecond = Date.parse(teamDealEndedAt);
    const remainingTimeInDS = (teamDealEndedAtInMillisecond - currentTime) / 100;
    if (remainingTimeInDS <= 0) {
      setRemainingTimeString('deal has ended');
    } else {
      let hrs = Math.floor(remainingTimeInDS / 36000);
      let mins = Math.floor(remainingTimeInDS / 600) % 60;
      let seconds = Math.floor(remainingTimeInDS / 10) % 60;
      const ds = Math.floor(remainingTimeInDS % 10);
      setRemainingHr(hrs);

      hrs = hrs < 10 ? '0' + hrs : hrs;
      mins = mins < 10 ? '0' + mins : mins;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      setRemainingTimeString(`${hrs} : ${mins} : ${seconds} : ${ds}`);
    }
  }, [teamDealEndedAt]);

  //--------------------------------------------------------------------------

  useEffect(() => {
    const countDownInterval = setInterval(() => {
      updateRemainingTime();
    }, 100);
    return () => {
      clearInterval(countDownInterval);
    };
  }, [updateRemainingTime]);

  //-------------------------------------------------------------------------------------------------------------------------------------

  return <span className={`m-0 fw-bold ${remainingHr < 24 ? 'text-danger' : 'text-warning'}`}>{remainingTimeString}</span>;
}
