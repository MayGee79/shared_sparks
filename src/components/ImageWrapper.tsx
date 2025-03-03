'use client';

import * as React from 'react';

type ImageWrapperProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function ImageWrapper({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false
}: ImageWrapperProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}