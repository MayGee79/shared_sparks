'use client';

import React from 'react';
import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material';

export interface SkeletonProps extends MuiSkeletonProps {
  // Add any custom props here
}

export function Skeleton(props: SkeletonProps) {
  return <MuiSkeleton {...props} />;
}

export default Skeleton; 