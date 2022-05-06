import React from 'react';

export default function UserInput({ type, placeholder, id, onChangeFunction, margin, defaultValue }) {
  return <input id={id} placeholder={placeholder} className={`form-control radius-custom input-custom ${margin}`} onChange={onChangeFunction} type={type} defaultValue={defaultValue} />;
}
