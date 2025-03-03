'use client';

import * as React from 'react';  // Import the full React namespace 
import { useRouter } from 'next/navigation';

type LinkWrapperProps = {
  href: string;
  children: React.ReactNode;  // Use React.ReactNode explicitly
  style?: React.CSSProperties;
};

export function LinkWrapper({ href, children, style = {} }: LinkWrapperProps) {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };
  
  return (
    // Simple anchor tag implementation avoids Next.js Link typing issues
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
}