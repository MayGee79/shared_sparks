'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export function Input({ variant = 'outlined', ...props }: InputProps) {
  return <TextField variant={variant} fullWidth {...props} />;
}

export default Input; 