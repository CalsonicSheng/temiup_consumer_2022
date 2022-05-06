import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { countryList, ProvinceList, stateList } from '../../data/constantData';
import { createTargetUserNewAddressRequestHandler, updateTargetUserSelectedAddressRequestHandler } from '../../data/slices/addressSlice';
import LoadingSpinner from '../loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../message_box/ErrorMessageBox';
import UserInput from '../user_input/UserInput';

// "selectedEditingAddressInfo" is only provided when edit button is click
export default function AddressForm({ isCRUDLoading, CRUDResult, selectedEditingAddressInfo, formWidthPercentage, paddingEnd, isInCheckOutScreen }) {
  const [fNameInput, setFNameInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.firstName : '');
  const [lNameInput, setLNameInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.lastName : '');
  const [addressInput, setAddressInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.address : '');
  const [additionalAddressInput, setAdditionalAddressInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.additionalAddress : '');
  const [cityInput, setCityInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.city : '');
  const [selectedCountryInput, setSelectedCountryInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.country : 'Canada');
  const [selectedProvinceOrStateInput, setselectedProvinceOrStateInput] = useState(
    selectedEditingAddressInfo ? selectedEditingAddressInfo.provinceOrState : selectedCountryInput === 'Canada' ? 'Alberta' : 'Alabama'
  );
  const [zipCodeInput, setzipCodeInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.zipCode : '');
  const [phoneInput, setPhoneInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.phone : '');
  const [saveAsDefaultInput, setSaveAsDefaultInput] = useState(selectedEditingAddressInfo ? selectedEditingAddressInfo.isDefault : false);

  const dispatch = useDispatch();

  //--------------------------------------------------------------------------------------------------------------------------------------------

  function setFNameInputHandler(e) {
    setFNameInput(e.target.value);
  }
  function setLNameInputHandler(e) {
    setLNameInput(e.target.value);
  }
  function setAddressInputHandler(e) {
    setAddressInput(e.target.value);
  }

  function setAdditionalAddressInputHandler(e) {
    setAdditionalAddressInput(e.target.value);
  }
  function setCityInputHandler(e) {
    setCityInput(e.target.value);
  }

  function setSelectedCountryInputHandler(e) {
    setSelectedCountryInput(e.target.value);
  }

  function setselectedProvinceOrStateInputHandler(e) {
    setselectedProvinceOrStateInput(e.target.value);
  }

  function setzipCodeInputHandler(e) {
    setzipCodeInput(e.target.value);
  }
  function setPhoneInputHandler(e) {
    setPhoneInput(e.target.value);
  }

  function setSaveAsDefaultInputHandler(e) {
    setSaveAsDefaultInput((currentState) => {
      return !currentState;
    });
  }

  //--------------------------------------------------------------------------------------------------------------------

  function AddAddressHandler() {
    dispatch(
      createTargetUserNewAddressRequestHandler({
        requestBodyObject: {
          // "userId" field is added directly in the backend instead
          fNameInput,
          lNameInput,
          addressInput,
          additionalAddressInput,
          cityInput,
          selectedCountryInput,
          selectedProvinceOrStateInput,
          zipCodeInput,
          phoneInput,
          saveAsDefaultInput,
          addressSummary: `${addressInput},${
            additionalAddressInput === '' ? '' : ' ' + additionalAddressInput + ','
          } ${cityInput} ${selectedProvinceOrStateInput} ${selectedCountryInput}, ${zipCodeInput} (${fNameInput} ${lNameInput})`,
        },
      })
    );
  }

  function updateAddressHandler() {
    dispatch(
      updateTargetUserSelectedAddressRequestHandler({
        selectedAddressId: selectedEditingAddressInfo._id,
        requestBodyObject: {
          fNameInput,
          lNameInput,
          addressInput,
          additionalAddressInput,
          cityInput,
          selectedCountryInput,
          selectedProvinceOrStateInput,
          zipCodeInput,
          phoneInput,
          saveAsDefaultInput,
          addressSummary: `${addressInput},${
            additionalAddressInput === '' ? '' : ' ' + additionalAddressInput + ','
          } ${cityInput} ${selectedProvinceOrStateInput} ${selectedCountryInput}, ${zipCodeInput} (${fNameInput} ${lNameInput})`,
        },
      })
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className={`${formWidthPercentage} ${paddingEnd}`}>
      {!isInCheckOutScreen && <h4 className={`p-0 m-0 fw-bold mb-3`}>Add Address</h4>}
      <div className="row">
        <div className="col">
          {/* first and last name group ---------------------------------------------------------------------------------------- */}
          <UserInput type="text" placeholder="First name" onChangeFunction={setFNameInputHandler} defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.firstName} />
        </div>
        <div className="col">
          <UserInput type="text" placeholder="Last name" onChangeFunction={setLNameInputHandler} defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.lastName} />
        </div>
      </div>
      {/* address -------------------------------------------------------------------------------------------- */}
      <UserInput type="text" placeholder="Address" margin="mt-3" onChangeFunction={setAddressInputHandler} defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.address} />

      {/* additional ------------------------------------------------------------------------------------------ */}

      <UserInput
        type="text"
        placeholder="Apartment, suite, etc (optional)"
        margin="mt-3"
        onChangeFunction={setAdditionalAddressInputHandler}
        defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.additionalAddress}
      />

      {/* city -------------------------------------------------------------------------------------------------- */}

      <UserInput type="text" placeholder="City" margin="mt-3" onChangeFunction={setCityInputHandler} defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.city} />

      {/* country / province / state group ---------------------------------------------------------------------------------------- */}

      <div className="row align-items-center mt-3">
        <div className="col">
          <select className="form-select bg-light text-dark py-2 px-3 radius-custom py-2 pe-0" onChange={setSelectedCountryInputHandler} value={selectedCountryInput}>
            {countryList.map((e) => {
              return (
                <option value={e} key={e}>
                  {e}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col">
          {selectedCountryInput === 'Canada' ? (
            <select className="form-select bg-light text-dark py-2 px-3 radius-custom py-2 pe-0" onChange={setselectedProvinceOrStateInputHandler} value={selectedProvinceOrStateInput}>
              {ProvinceList.map((e) => {
                return (
                  <option value={e} key={e}>
                    {e}
                  </option>
                );
              })}
            </select>
          ) : (
            <select className="form-select bg-light text-dark py-2 px-3 radius-custom py-2 pe-0" onChange={setselectedProvinceOrStateInputHandler} value={selectedProvinceOrStateInput}>
              {stateList.map((e) => {
                return (
                  <option value={e} key={e}>
                    {e}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* zip code ---------------------------------------------------------------------------------------------------------------------- */}
        <div className="col">
          <UserInput type="text" placeholder="ZIP Code" onChangeFunction={setzipCodeInputHandler} defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.zipCode} />
        </div>
      </div>

      {/* phone --------------------------------------------------------------------------------------------------------------------------- */}

      <UserInput type="tel" placeholder="Phone" margin="mt-3" onChangeFunction={setPhoneInputHandler} defaultValue={selectedEditingAddressInfo && selectedEditingAddressInfo.phone} />

      {/* save as default --------------------------------------------------------------------------------------------------------------------------- */}
      <div className="form-check mt-3">
        <input className="form-check-input p-1 bg-info" type="checkbox" id="setAddressAsDefault" onChange={setSaveAsDefaultInputHandler} checked={saveAsDefaultInput} />
        <label className="form-check-label" htmlFor="setAddressAsDefault">
          Save this address as default
        </label>
      </div>

      {/* potentially error display --------------------------------------------------------------------------------------------------------------------------- */}
      {CRUDResult.error && (
        <ErrorMessageBox marginSetting={'mt-4'}>
          <h6 className="m-0 p-0">{CRUDResult.error.customizedMessage}</h6>
        </ErrorMessageBox>
      )}

      {/* add address button ---------------------------------------------------------------------------------------------------------------------------------- */}

      {isCRUDLoading ? (
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-outline-info py-2 radius-custom mt-5 ms-auto" style={{ width: '20%' }} disabled={true}>
            <LoadingSpinner heightValue="18px" widthValue="18px" />
          </button>
        </div>
      ) : (
        <div className="d-flex justify-content-end">
          <button type="button" className=" btn btn-outline-info py-2 radius-custom mt-5 " style={{ width: '20%' }} onClick={selectedEditingAddressInfo ? updateAddressHandler : AddAddressHandler}>
            <span className="p-0 m-0 fw-bold"> {selectedEditingAddressInfo ? 'Edit Address' : isInCheckOutScreen ? 'Continue' : 'Add address'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
