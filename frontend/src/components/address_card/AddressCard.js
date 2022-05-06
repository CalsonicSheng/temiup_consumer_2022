import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addressSliceSyncActions, deleteTargetUserSelectedAddressRequestHandler } from '../../data/slices/addressSlice';

export default function AddressCard({ eachAddressInfo, enableEditAddressHandler }) {
  const dispatch = useDispatch();

  const { isCRUDLoading } = useSelector((state) => {
    return state.addressReducer;
  });

  //-----------------------------------------------------------------

  function editAddressHandler() {
    enableEditAddressHandler(eachAddressInfo);
  }

  function deleteAddressHandler() {
    dispatch(addressSliceSyncActions.resetCRUDResultStateHandler());
    dispatch(deleteTargetUserSelectedAddressRequestHandler({ selectedAddressId: eachAddressInfo._id }));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="card border-info mb-3 radius-custom">
      <div className="card-header ">
        <h5 className="text-warning p-0 m-0">{eachAddressInfo.isDefault && 'Default'}</h5>
      </div>
      <div className="card-body">
        <span className="me-1">{eachAddressInfo.firstName}</span>
        <span>{eachAddressInfo.lastName}</span>
        <p className="p-0 m-0">{eachAddressInfo.address}</p>
        {eachAddressInfo.additionalAddress !== '' && <p>{eachAddressInfo.additionalAddress}</p>}
        <span>{eachAddressInfo.city}</span>
        <span>{eachAddressInfo.zipCode}</span>
        <p className="p-0 m-0">{eachAddressInfo.country}</p>
        <div className="mt-3">
          <button type="button" className="btn btn-info me-3 radius-custom" onClick={editAddressHandler}>
            <span className="p-0 m-0 fw-bold">Edit</span>
          </button>

          {isCRUDLoading ? (
            <button type="button" className="btn btn-info radius-custom" disabled={true}>
              <span className="p-0 m-0 fw-bold">Delete</span>
            </button>
          ) : (
            <button type="button" className="btn btn-info radius-custom" onClick={deleteAddressHandler}>
              <span className="p-0 m-0 fw-bold">Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
