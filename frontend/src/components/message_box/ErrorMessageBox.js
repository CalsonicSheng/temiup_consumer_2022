import React from 'react';
import customClasses from './customStyle.module.css';

export default function ErrorMessageBox({ marginSetting, children }) {
  return <div className={`w-100 bg-danger radius-custom py-2 ps-3 ${customClasses['error-box-shadow-custom']} ${marginSetting}`}>{children}</div>;
}
