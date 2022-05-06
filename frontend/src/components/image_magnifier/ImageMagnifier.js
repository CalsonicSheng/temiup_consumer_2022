import React, { useState } from 'react';
import customClasses from './customStyle.module.css';

export default function ImageMagnifier({ imgSrc }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

  function mouseEnterHandler(e) {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  }

  function mouseLeaveHandler() {
    setShowMagnifier(false);
  }

  function mouseMoveHandler(e) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    const x_track = e.pageX - left - window.pageXOffset;
    const y_track = e.pageY - top - window.pageYOffset;
    setXY([x_track, y_track]);
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className={`${customClasses['image-magnifier-container']}`}>
      <img src={imgSrc} className={`${customClasses['image-custom']} w-100 radius-custom`} onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler} onMouseMove={mouseMoveHandler} alt="..." />
      <div
        className={`${customClasses['magnifier-custom']}`}
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',

          // prevent magnifier blocks the mousemove event of img
          pointerEvents: 'none',
          // set size of magnifier
          height: `${150}px`,
          width: `${150}px`,
          // move element center to cursor pos
          top: `${y - 150 / 2}px`,
          left: `${x - 150 / 2}px`,
          opacity: '1', // reduce opacity so you can verify position
          border: '2px solid lightgray',
          borderRadius: '15px',
          backgroundColor: '#17082e',
          backgroundImage: `url('${imgSrc}')`,
          backgroundRepeat: 'no-repeat',

          //calculate zoomed image size
          backgroundSize: `${imgWidth * 1.4}px ${imgHeight * 1.4}px`,

          //calculate position of zoomed image.
          backgroundPositionX: `${-x * 1.4 + 150 / 2}px`,
          backgroundPositionY: `${-y * 1.4 + 150 / 2}px`,
        }}
      ></div>
    </div>
  );
}
