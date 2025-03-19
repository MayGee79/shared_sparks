'use client';

import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material';

export interface AlertProps extends MuiAlertProps {
  // Add any custom props here
}

export function Alert({ children, ...props }: AlertProps) {
  return <MuiAlert {...props}>{children}</MuiAlert>;
}

export default Alert; 