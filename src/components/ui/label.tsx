'use client';

import React from 'react';
import { FormLabel, FormLabelProps } from '@mui/material';

export interface LabelProps extends FormLabelProps {
  // Add any custom props here
}

export function Label({ children, ...props }: LabelProps) {
  return <FormLabel {...props}>{children}</FormLabel>;
}

export default Label; 