'use client';

import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia
} from '@mui/material';

export interface CardProps extends MuiCardProps {
  // Add any custom props here
}

export function Card({ children, ...props }: CardProps) {
  return <MuiCard {...props}>{children}</MuiCard>;
}

Card.Content = CardContent;
Card.Header = CardHeader;
Card.Actions = CardActions;
Card.Media = CardMedia;

export default Card; 