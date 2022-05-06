import React from 'react';
import { Link } from 'react-router-dom';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';

export default function OrderScreenErrorScreen() {
  return (
    <>
      <WarningMessageBox>
        <h5 className="m-0 p-0 text-danger">Your order may not be placed because the team round has just finished - someone else may join before you </h5>
      </WarningMessageBox>
      <Link to={'/'}>
        <button type="button" className=" btn btn-outline-info py-2  radius-custom mt-5">
          <span className="p-0 m-0 fw-bold">Back to Home</span>
        </button>
      </Link>
    </>
  );
}
