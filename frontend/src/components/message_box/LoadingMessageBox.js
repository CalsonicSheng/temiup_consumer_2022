import React from 'react';
import customClasses from './customStyle.module.css';

export default function LoadingMessageBox({ marginSetting, children }) {
  return <div className={`w-100 bg-info radius-custom py-2 ps-3 d-flex align-items-center ${customClasses['loading-box-shadow-custom']} ${marginSetting}`}>{children}</div>;
}
