import React from 'react';
import customClasses from './customStyle.module.css';

export default function WarningMessageBox({ marginSetting, children }) {
  return <div className={`w-100 bg-warning radius-custom py-2 ps-3 d-flex align-items-center ${customClasses['warning-box-shadow-custom']} ${marginSetting}`}>{children}</div>;
}
