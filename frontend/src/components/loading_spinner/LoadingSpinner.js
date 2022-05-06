import React from 'react';

export default function LoadingSpinner({ heightValue, widthValue }) {
  return <div className="spinner-border text-warning p-0 m-0" role="status" style={{ width: widthValue, height: heightValue }}></div>;
}
